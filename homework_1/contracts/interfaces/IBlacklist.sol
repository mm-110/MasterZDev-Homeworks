//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IBlacklist {
    function getBlacklistStatus(address _maker) external view returns (bool);
    function addBlacklist(address _evilUser, address token) external;
    function removeBlacklist(address _clearedUser, address token) external;
}