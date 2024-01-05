//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

// npm install @chainlink/contracts --save
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumer2V3 {
    AggregatorV3Interface internal priceFeed;

    /**
     * network: mainnet
     * aggregator: ETH/USD
     * address: ox5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
     */

    constructor(address clOracleAddress) {
        priceFeed = AggregatorV3Interface(clOracleAddress);
    }

    function getLatestPrice() public view returns (int256){
        (
            /*uint80 roundId*/,
            int256 price,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }

    function getPriceDecimals() public view returns (uint) {
        return uint(priceFeed.decimals());
    }
}