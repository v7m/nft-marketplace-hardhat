const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.1");

async function mintAndList() {
    const basicIpfsNft = await ethers.getContract("BasicIpfsNft");
    console.log("Minting NFT...");
    const mintTx = await basicIpfsNft.mintNft();
    const mintTxReceipt = await mintTx.wait(1);
    console.log(`Minted tokenId ${mintTxReceipt.events[0].args.tokenId.toString()} from contract: ${basicIpfsNft.address}`);
    if (network.config.chainId == 31337) {
        await moveBlocks(2, (sleepAmount = 1000));
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });
