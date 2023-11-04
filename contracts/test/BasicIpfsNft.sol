// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BasicIpfsNft is ERC721 {
    string public constant TOKEN_URI = "ipfs://QmextHQFZiDihEphLqcdkJcgLnUeGtdFDWiKatw2nF2Vkm";
    using Counters for Counters.Counter;
    Counters.Counter private s_tokenCounter;

    event NftMinted(uint256 indexed tokenId);

    constructor() ERC721("Basic IPFS NFT", "BIN") {
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter.current());
        emit NftMinted(s_tokenCounter.current());
        s_tokenCounter.increment();
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter.current();
    }
}
