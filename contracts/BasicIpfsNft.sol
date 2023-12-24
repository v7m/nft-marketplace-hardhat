// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title BasicIpfsNft
 * @dev This contract represents a basic ERC721 NFT contract with IPFS integration.
 */
contract BasicIpfsNft is ERC721 {
    string public constant TOKEN_URI = "ipfs://QmextHQFZiDihEphLqcdkJcgLnUeGtdFDWiKatw2nF2Vkm";
    using Counters for Counters.Counter;
    Counters.Counter private s_tokenCounter;

    event NftMinted(uint256 indexed tokenId);

    /**
     * @dev Initializes the contract by setting the name and symbol of the NFT.
     */
    constructor() ERC721("Basic IPFS NFT", "BIN") {}

    /**
     * @dev Mints a new NFT and assigns it to the caller.
     */
    function mintNft() external {
        _safeMint(msg.sender, s_tokenCounter.current());
        emit NftMinted(s_tokenCounter.current());
        s_tokenCounter.increment();
    }

    /**
     * @dev Returns the current token counter.
     * @return The current token counter.
     */
    function getTokenCounter() external view returns (uint256) {
        return s_tokenCounter.current();
    }

    /**
     * @dev Returns the token URI for a given token ID.
     * @param tokenId The ID of the token.
     * @return The token URI.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return TOKEN_URI;
    }
}
