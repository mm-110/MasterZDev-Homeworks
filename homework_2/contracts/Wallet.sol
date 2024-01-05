//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./PriceConsumer.sol";

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Wallet is Ownable {
    uint public constant usdDecimals = 2;
    uint public constant nftDecimals = 18;
    uint public constant nftPrice = 100; // ETH
    uint public ownerEthAmountToWithdraw;
    uint public ownerTokenAmountToWithdraw;

    address public oracleEthUsdPrice;
    address public oracleTokenEthPrice;

    PriceConsumerV3 public ethUsdContract;
    PriceConsumerV3 public tokenEthContract;

    mapping(address => uint256) public userEthDeposits;
    mapping(address => mapping(address => uint256)) public userTokenDeposits;

    constructor(address clEthUsd, address clTokenUsd) {
        oracleEthUsdPrice = clEthUsd;
        oracleTokenEthPrice = clTokenUsd;

        ethUsdContract = new PriceConsumerV3(oracleEthUsdPrice);
        tokenEthContract = new PriceConsumerV3(oracleTokenEthPrice);
    }

    receive() external payable {
        registerUserDeposit(msg.sender, msg.value);
    }

    function registerUserDeposit(address sender, uint value) internal {
        userEthDeposits[sender] += value;
    }

    function getNftPrice() external view returns (uint256) {
        uint256 price;
        int iPrice;
        AggregatorV3Interface nftOraclePrice = AggregatorV3Interface(oracleTokenEthPrice);
        (, iPrice, , , ) = nftOraclePrice.latestRoundData();
        price = uint256(iPrice);
        return price;
    }

    function convertEthInUsd(address user) public view returns (uint) {
        uint ethPriceDecimals = ethUsdContract.getPriceDecimals();
        uint ethPrice = uint(ethUsdContract.getLatestPrice());
        uint divDecs = 18 + ethPriceDecimals - usdDecimals;
        uint userUsdDeposits = userEthDeposits[user] * ethPrice / (10 ** divDecs);
        return userUsdDeposits;
    }

    function convertUsdInEth(uint usdAmount) public view returns (uint) {
        uint ethPriceDecimals = ethUsdContract.getPriceDecimals();
        uint ethPrice = uint(ethUsdContract.getLatestPrice());
        uint mulDecs = 18 + ethPriceDecimals - usdDecimals;
        uint convertAmountInEth = usdAmount * (18 ** mulDecs) / ethPrice;
        return convertAmountInEth;
    }

    function transferEthAmountOnBuy(uint nftNumber) public {
        uint calcTotalUsdAmount = nftPrice * nftNumber * (10 ** 2);
        uint ethAmountForBuying = convertUsdInEth(calcTotalUsdAmount);
        require(userEthDeposits[msg.sender] >= ethAmountForBuying, "not enough deposits by the user");
        ownerEthAmountToWithdraw += ethAmountForBuying;
        userEthDeposits[msg.sender] -= ethAmountForBuying;
    }

    function userDeposit(address token, uint256 amount) external {
        SafeERC20.safeTransferFrom(IERC20(token), msg.sender, address(this), amount);
        userTokenDeposits[msg.sender][token] += amount;
    }

    function convertTokenInUsd(address token, address user) public view returns (uint) {
        uint tokenPriceDecimals = tokenEthContract.getPriceDecimals();
        uint tokenPrice = uint(tokenEthContract.getLatestPrice());
        uint divDecs = 18 + tokenPriceDecimals - usdDecimals;

        uint userUsdDeposit = userTokenDeposits[user][token] * tokenPrice / (10 ** divDecs);
        return userUsdDeposit;
    }

    function convertNftPriceInUsd() public view returns (uint) {
        uint tokenPriceDecimals = tokenEthContract.getPriceDecimals();
        uint tokenPrice = uint(tokenEthContract.getLatestPrice());

        uint ethPriceDecimals = ethUsdContract.getPriceDecimals();
        uint ethPrice = uint(ethUsdContract.getLatestPrice());
        uint divDecs = tokenPriceDecimals + ethPriceDecimals - usdDecimals;

        uint tokenUsdPrice = tokenPrice * ethPrice / (10 ** divDecs);
        return tokenUsdPrice;
    }

    function convertUsdInToken(uint usdAmount) public view returns (uint) {
        uint tokenPriceDecimals = tokenEthContract.getPriceDecimals();
        uint tokenPrice = uint(tokenEthContract.getLatestPrice());

        uint ethPriceDecimals = ethUsdContract.getPriceDecimals();
        uint ethPrice = uint(ethUsdContract.getLatestPrice());

        uint mulDecs = ethPriceDecimals + tokenPriceDecimals - usdDecimals;
        uint amountInEth = usdAmount * (10 ** mulDecs) / ethPrice;
        uint amountInTokens = amountInEth / tokenPrice;
        return amountInTokens;
    }

    function transferTokenAmountOnBuy(address token, uint nftNumber) public {
        uint calcTotalUsdAmount = nftPrice * nftNumber * (10 ** 2);
        uint tokenAmountForBuying = convertUsdInToken(calcTotalUsdAmount);
        require(userTokenDeposits[msg.sender][token] >= tokenAmountForBuying, "not enough deposits by the user");
        ownerTokenAmountToWithdraw += tokenAmountForBuying;
        userTokenDeposits[msg.sender][token] -= tokenAmountForBuying;
    }

    function getNativeCoinsBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getTokenBalance(address _token) external view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

}