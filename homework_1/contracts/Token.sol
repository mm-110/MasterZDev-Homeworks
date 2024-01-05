//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IBlacklist.sol";

contract Token is ERC20, Ownable {

    IBlacklist public blacklistContract;

    constructor(string memory tokenName, string memory tokenSym, address blAddress) ERC20(tokenName, tokenSym) {
        blacklistContract = IBlacklist(blAddress);
    }

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function insertInBlacklist(address user) external onlyOwner{
        blacklistContract.addBlacklist(user, address(this));
    }

    function removeFromBlacklist(address user) external onlyOwner{
        blacklistContract.removeBlacklist(user, address(this));
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal view override {
        amount;
        if(blacklistContract.getBlacklistStatus(from) || blacklistContract.getBlacklistStatus(to)){
            revert("Blacklisted Address");
        }
    }
}