// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Images is ERC1155Supply, Ownable{

    uint256 public constant PAPER1 = 1;
    uint256 public constant PAPER2 = 2;
    uint256 public constant PAPER3 = 3;
    uint256 public constant PAPER4 = 4;
    uint256 public constant PAPER5 = 5;

    mapping(uint256 => string) public _uris;

    constructor() ERC1155("ipfs://QmXG3meHqjnxa9XjpTvxDrmSeMEWjQ7eSCSqoWJeUF4kPx/{id}.json") {

    }

    function mint(address to, uint256 id, uint256 amount, bytes memory data) external onlyOwner {
        _mint(to, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) external onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function setTokenUri(uint256 tokenId, string calldata tokenUri) external onlyOwner {
        _uris[tokenId] = tokenUri;
    }

    function getTokenUri(uint256 tokenId) external view returns (string memory) {
        return _uris[tokenId];
    }

}