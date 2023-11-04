const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../../utils/move-blocks");

const TOKEN_ID = 4;

async function cancelItemListing() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const basicIpfsNft = await ethers.getContract("BasicIpfsNft");
    const tx = await nftMarketplace.cancelListing(basicIpfsNft.address, TOKEN_ID);
    await tx.wait(1);
    console.log("NFT Canceled!");
    if ((network.config.chainId == "31337")) {
        await moveBlocks(2, (sleepAmount = 1000));
    }
}

cancelItemListing()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });
