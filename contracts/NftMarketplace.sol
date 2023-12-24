// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

error NftMarketplace__PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error NftMarketplace__ItemIsNotListed(address nftAddress, uint256 tokenId);
error NftMarketplace__ItemAlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NoProceeds();
error NftMarketplace__NotItemOwner();
error NftMarketplace__ItemNotApprovedForMarketplace();
error NftMarketplace__ItemPriceMustBeAboveZero();
error NftMarketplace__WithdrawProceedsFail();

/**
 * @title NftMarketplace
 * @dev A smart contract for a decentralized NFT marketplace.
 */
contract NftMarketplace is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds;

    /**
     * @dev Modifier to check if an NFT is not listed in the marketplace.
     * @param nftAddress The address of the NFT contract.
     * @param tokenId The ID of the NFT token.
     */
    modifier notListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NftMarketplace__ItemAlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    /**
     * @dev Modifier to check if an NFT is listed for sale.
     * @notice This modifier checks if the specified NFT is listed for sale by checking its price.
     * @param nftAddress The address of the NFT contract.
     * @param tokenId The ID of the NFT.
     */
    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];

        if (listing.price <= 0) {
            revert NftMarketplace__ItemIsNotListed(nftAddress, tokenId);
        }
        _;
    }

    /**
     * @dev Modifier to check if the caller is the owner of the NFT.
     * @notice This modifier ensures that the caller is the owner of the NFT before executing the function.
     * @param nftAddress The address of the NFT contract.
     * @param tokenId The ID of the NFT.
     * @param spender The address of the caller.
     */
    modifier isOwner(address nftAddress, uint256 tokenId, address spender) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NftMarketplace__NotItemOwner();
        }
        _;
    }

    /**
     * @dev Lists an NFT for sale in the marketplace.
     * @param nftAddress The address of the NFT contract.
     * @param tokenId The ID of the NFT being listed.
     * @param price The price at which the NFT is listed for sale.
     */
    function listItem(address nftAddress, uint256 tokenId, uint256 price)
        external
        notListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert NftMarketplace__ItemPriceMustBeAboveZero();
        }
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__ItemNotApprovedForMarketplace();
        }
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    /**
     * @dev Cancels an existing listing.
     * @notice This function can only be called by the owner of the NFT.
     * @param nftAddress The address of the NFT contract.
     * @param tokenId The ID of the NFT being canceled.
     */
    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    /**
     * @dev Buys an NFT listed for sale in the marketplace.
     * @notice This function can only be called by the owner of the NFT.
     * @param nftAddress The address of the NFT contract.
     * @param tokenId The ID of the NFT being purchased.
     */
    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        isListed(nftAddress, tokenId)
        nonReentrant
    {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert NftMarketplace__PriceNotMet(nftAddress, tokenId, listedItem.price);
        }
        s_proceeds[listedItem.seller] += msg.value;
        delete (s_listings[nftAddress][tokenId]);
        IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    /**
     * @dev Updates the price of an existing listing.
     * @notice This function can only be called by the owner of the NFT.
     * @param nftAddress The address of the NFT contract.
     * @param tokenId The ID of the NFT being updated.
     * @param newPrice The new price of the NFT.
     */
    function updateListing(address nftAddress, uint256 tokenId, uint256 newPrice)
        external
        isListed(nftAddress, tokenId)
        nonReentrant
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (newPrice <= 0) {
            revert NftMarketplace__ItemPriceMustBeAboveZero();
        }
        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    /**
     * @dev Withdraws the proceeds of an NFT sale.
     * @notice This function can only be called by the seller of the NFT.
     */
    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NftMarketplace__NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) {
            revert NftMarketplace__WithdrawProceedsFail();
        }
    }

    /**
     * @dev Returns the listing of an NFT.
     * @param nftAddress The address of the NFT contract.
     * @param tokenId The ID of the NFT.
     */
    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    /**
     * @dev Returns the proceeds of an NFT sale.
     * @param seller The address of the seller.
     */
    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}
