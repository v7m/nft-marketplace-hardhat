// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "hardhat/console.sol";

error ERC721Metadata__TokenNotExist();
error DynamicSvgNft__NotEnougthAmount();
error DynamicSvgNft__ContractAlreadyInitialized();

contract DynamicSvgNft is ERC721URIStorage, VRFConsumerBaseV2  {
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_vrfSubscriptionId;
    bytes32 private immutable i_vrfGasLane;
    uint32 private immutable i_vrfCallbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private s_tokenCounter;
    uint256 private immutable i_mintFee;
    string[] s_base64Shapes;
    string[] s_svgShapes;
    bool private s_initialized;
    uint256 internal constant MAX_SHAPES_COUNT = 4;

    mapping(uint256 => address) public s_requestIdToSender;

    event NftMintRequested(uint256 indexed requestId, address requester);
    event NftMinted(uint256 indexed tokenId, address minter);

    constructor(
        address vrfCoordinatorV2,
        uint64 vrfSubscriptionId,
        bytes32 vrfGasLane,
        uint32 vrfCallbackGasLimit,
        uint256 mintFee,
        string[4] memory svgShapes
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Dynamic SVG NFT", "DSN") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_vrfGasLane = vrfGasLane;
        i_vrfSubscriptionId = vrfSubscriptionId;
        i_vrfCallbackGasLimit = vrfCallbackGasLimit;
        i_mintFee = mintFee;
        _initializeContract(svgShapes);
    }

    function _initializeContract(string[4] memory svgShapes) private {
        if (s_initialized) {
            revert DynamicSvgNft__ContractAlreadyInitialized();
        }

        for (uint256 i = 0; i < svgShapes.length; i++) {
            string memory transformedValue = svgToBase64(svgShapes[i]);
            s_base64Shapes.push(transformedValue);
        }

        s_svgShapes = svgShapes;
        s_initialized = true;
    }

    function requestNftMint() public payable returns (uint256 requestId) {
        if (msg.value < i_mintFee) {
            revert DynamicSvgNft__NotEnougthAmount();
        }

        requestId = i_vrfCoordinator.requestRandomWords(
            i_vrfGasLane,
            i_vrfSubscriptionId,
            REQUEST_CONFIRMATIONS,
            i_vrfCallbackGasLimit,
            NUM_WORDS
        );

        s_requestIdToSender[requestId] = msg.sender;
        emit NftMintRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address minter = s_requestIdToSender[requestId];
        uint256 newItemId = s_tokenCounter.current();
        uint256 randomShapeIndex = randomWords[0] % MAX_SHAPES_COUNT;
        _safeMint(minter, newItemId);
        _setTokenURI(newItemId, generateTokenURI(newItemId, s_base64Shapes[randomShapeIndex]));
        s_tokenCounter.increment();
        emit NftMinted(s_tokenCounter.current(), minter);
    }

    function svgToBase64(string memory svgString) public pure returns (string memory) {
        bytes memory svg = abi.encodePacked(svgString);

        return string(
            abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(svg))
        );
    }

    function generateTokenURI(uint256 tokenId, string memory imageURI) public view returns (string memory) {
        if (!_exists(tokenId)) {
            revert ERC721Metadata__TokenNotExist();
        }

        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "Dynamic SVG NFT #', tokenId.toString(), '", ',
                '"description": "Dynamic on-chain SVG NFT", ',
                '"image": "', imageURI, '"',
            '}'
        );

        return string(
            abi.encodePacked("data:application/json;base64,", Base64.encode(dataURI))
        );
    }

    function getSvgShape(uint256 index) public view returns (string memory) {
        return s_svgShapes[index];
    }

    function getBase64Shape(uint256 index) public view returns (string memory) {
        return s_base64Shapes[index];
    }
    
    function getSvgShapesCount() public view returns (uint256) {
        return s_svgShapes.length;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter.current();
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }
}