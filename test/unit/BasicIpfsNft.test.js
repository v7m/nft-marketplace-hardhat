const { expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic IPFS NFT Unit Tests", function () {
        let basicIpfsNft, deployer;

        beforeEach(async () => {
            accounts = await ethers.getSigners();
            deployer = accounts[0];
            await deployments.fixture(["basicIpfsNft"]);
            basicIpfsNft = await ethers.getContract("BasicIpfsNft");
        })

        describe("constructor", () => {
            it("Initializes the NFT correctly", async () => {
                const name = await basicIpfsNft.name();
                const symbol = await basicIpfsNft.symbol();
                const tokenCounter = await basicIpfsNft.getTokenCounter();

                expect(name).to.eq("Basic IPFS NFT");
                expect(symbol).to.eq("BIN");
                expect(tokenCounter.toString()).to.eq("0");
            })
        })

        describe("mintNft", () => {
            beforeEach(async () => {
                const txResponse = await basicIpfsNft.mintNft();
                await txResponse.wait(1);
            });

            it("mints an NFT", async function () {
                const tokenURI = await basicIpfsNft.tokenURI(0);
                const tokenCounter = await basicIpfsNft.getTokenCounter();
                const tokenUri = await basicIpfsNft.TOKEN_URI()

                expect(tokenURI).to.eq(tokenUri);
                expect(tokenCounter.toString()).to.eq("1");
            });

            it("returns correct balance of an NFT", async function () {
                const deployerAddress = deployer.address;
                const deployerBalance = await basicIpfsNft.balanceOf(deployerAddress);
                const owner = await basicIpfsNft.ownerOf("0");

                expect(owner).to.eq(deployerAddress);
                expect(deployerBalance.toString()).to.eq("1");
            });
        });
    });
