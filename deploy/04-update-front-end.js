const { FRONTEND_CONTRACT_ADDERS_FILE, FRONTEND_CONTRACT_ABI_DIRECTORY } = require("../helper-hardhat-config");
require("dotenv").config();
const fs = require("fs");
const { network } = require("hardhat");

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating contract addresses and ABI on frontend...");
        await updateContractAddresses();
        await updateContractAbi();

        console.log("----------------------------------------------------------");
        console.log("Contract addresses and ABI updated on frontend!");
        console.log("----------------------------------------------------------");
    }
}

async function updateContractAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    fs.writeFileSync(
        `${FRONTEND_CONTRACT_ABI_DIRECTORY}NftMarketplaceAbi.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    );

    const basicIpfsNft = await ethers.getContract("BasicIpfsNft");

    fs.writeFileSync(
        `${FRONTEND_CONTRACT_ABI_DIRECTORY}BasicIpfsNftAbi.json`,
        basicIpfsNft.interface.format(ethers.utils.FormatTypes.json)
    );

    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft");

    fs.writeFileSync(
        `${FRONTEND_CONTRACT_ABI_DIRECTORY}DynamicSvgNftAbi.json`,
        dynamicSvgNft.interface.format(ethers.utils.FormatTypes.json)
    );
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString();
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft");
    const basicIpfsNft = await ethers.getContract("BasicIpfsNft");
    const contractAddresses = JSON.parse(fs.readFileSync(FRONTEND_CONTRACT_ADDERS_FILE, "utf8"));

    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NftMarketplace"].includes(nftMarketplace.address)) {
            contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address);
        }

        if (!contractAddresses[chainId]["DynamicSvgNft"].includes(dynamicSvgNft.address)) {
            contractAddresses[chainId]["DynamicSvgNft"].push(dynamicSvgNft.address);
        }

        if (!contractAddresses[chainId]["BasicIpfsNft"].includes(basicIpfsNft.address)) {
            contractAddresses[chainId]["BasicIpfsNft"].push(basicIpfsNft.address);
        }
    } else {
        contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.address] };
        contractAddresses[chainId] = { dynamicSvgNft: [nftMarketplace.address] };
        contractAddresses[chainId] = { basicIpfsNft: [nftMarketplace.address] };

    }
    fs.writeFileSync(FRONTEND_CONTRACT_ADDERS_FILE, JSON.stringify(contractAddresses));
}
module.exports.tags = ["all", "frontend"];
