const { ethers } = require("hardhat");
const LOCALHOST_CHAIN_ID = 31337;
const SEPOLIA_CHAIN_ID = 11155111;
const MAINNET_CHAIN_ID = 1;
const VRF_GAS_LANE = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c"; // 30 gwei
const VRF_CALLBACK_GAS_LIMIT = "2000000";
const SEPOLIA_VRF_SUBSCRIPRION_ID = process.env.SEPOLIA_VRF_SUBSCRIPRION_ID;
const SEPOLIA_VRF_COORDINATOR_V2_CONTRACT = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";
const MINT_FEE = "10000000000000000" // 0.01 ETH
const FRONTEND_DIRECTORY = process.env.FRONTEND_DIRECTORY || "nft-marketplace-nextjs"
const FRONTEND_CONTRACT_ADDERS_FILE = `../${FRONTEND_DIRECTORY}/constants/networkMapping.json`;
const FRONTEND_CONTRACT_ABI_DIRECTORY = `../${FRONTEND_DIRECTORY}/constants/`;
const VERIFICATION_BLOCK_CONFIRMATIONS = 6

chainIds = {
    localhost: LOCALHOST_CHAIN_ID,
    sepolia: SEPOLIA_CHAIN_ID,
    mainnet: MAINNET_CHAIN_ID
}

const networkConfig = {
    default: {
        name: "hardhat",
    },
    [LOCALHOST_CHAIN_ID]: {
        name: "localhost",
        mintFee: MINT_FEE,
        vrfGasLane: VRF_GAS_LANE,
        vrfCallbackGasLimit: VRF_CALLBACK_GAS_LIMIT,
    },
    [SEPOLIA_CHAIN_ID]: {
        name: "sepolia",
        mintFee: MINT_FEE,
        vrfSubscriptionId: SEPOLIA_VRF_SUBSCRIPRION_ID,
        vrfGasLane: VRF_GAS_LANE,
        vrfCallbackGasLimit: VRF_CALLBACK_GAS_LIMIT,
        vrfCoordinatorV2: SEPOLIA_VRF_COORDINATOR_V2_CONTRACT,
    },
    [MAINNET_CHAIN_ID]: {
        name: "mainnet",
        mintFee: MINT_FEE,
    },
}

const developmentChains = ["hardhat", "localhost"];

module.exports = {
    chainIds,
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    FRONTEND_CONTRACT_ADDERS_FILE,
    FRONTEND_CONTRACT_ABI_DIRECTORY,
}
