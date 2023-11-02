const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.1");

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const basicIpfsNft = await ethers.getContract("BasicIpfsNft");
    console.log("Minting Basic IPFS NFT...");
    const mintTx = await basicIpfsNft.mintNft();
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.events[0].args.tokenId;
    console.log("Approving Basic IPFS NFT...");
    const approvalTx = await basicIpfsNft.approve(nftMarketplace.address, tokenId);
    await approvalTx.wait(1);
    console.log("Listing Basic IPFS NFT...");
    const tx = await nftMarketplace.listItem(basicIpfsNft.address, tokenId, PRICE);
    await tx.wait(1);
    console.log("Basic IPFS NFT Listed!");
    if (network.config.chainId == 31337) {
        await moveBlocks(1, (sleepAmount = 1000));
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });
