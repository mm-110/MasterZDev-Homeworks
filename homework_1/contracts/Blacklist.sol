//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IBlacklist.sol";

contract BlackList is Ownable, IBlacklist {

    mapping (address => bool) public isBlackListed;
    mapping (address => bool) public allowedTokens;

    event DestroyBlackFunds (address _blackListedUser, uint _balance);
    event AddedBlackList(address _user);
    event RemovedBlackList(address _user);

    constructor () {}

    function allowedToken(address token) external onlyOwner {
        if(token == address(0)){
            revert();
        }
        allowedTokens[token] = true;
    }

    function getBlacklistStatus(address _maker) external view returns (bool) {
        return isBlackListed[_maker];
    }

    function addBlacklist(address _evilUser, address token) external {
        if(!allowedTokens[token]){
            revert();
        }
        isBlackListed[_evilUser] = true;
        emit AddedBlackList(_evilUser);
    }

    function removeBlacklist(address _clearedUser, address token) external {
        if(!allowedTokens[token]){
            revert();
        }
        isBlackListed[_clearedUser] = false;
        emit RemovedBlackList(_clearedUser);
    }

}