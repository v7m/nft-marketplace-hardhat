const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFT Marketplace Unit Tests", function () {
        let nftMarketplace, nftMarketplaceContract, basicIpfsNft, basicIpfsNftContract;
        const PRICE = ethers.utils.parseEther("0.1");
        const TOKEN_ID = 0;

        beforeEach(async () => {
            accounts = await ethers.getSigners();
            deployer = accounts[0];
            user = accounts[1];
            await deployments.fixture(["all"]);
            nftMarketplaceContract = await ethers.getContract("NftMarketplace");
            nftMarketplace = nftMarketplaceContract.connect(deployer);
            basicIpfsNftContract = await ethers.getContract("BasicIpfsNft");
            basicIpfsNft = basicIpfsNftContract.connect(deployer);
            await basicIpfsNft.mintNft();
            await basicIpfsNft.approve(nftMarketplaceContract.address, TOKEN_ID);
        })

        describe("listItem", function () {
            context("when approved item is new, user is owner, price greater then 0", () => {
                it("sets seller and price after listing", async function () {
                    await nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, PRICE);
                    const listing = await nftMarketplace.getListing(basicIpfsNft.address, TOKEN_ID);

                    expect(listing.price.toString()).to.eq(PRICE.toString());
                    expect(listing.seller.toString()).to.eq(deployer.address);
                });

                it("emits an event after listing an item", async function () {
                    expect(await nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, PRICE)).to.emit("ItemListed");
                });
            });

            context("when item already listed", () => {
                beforeEach(async () => {
                    await nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, PRICE);
                });

                it("reverts transaction", async function () {
                    await expect(
                        nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, PRICE)
                    ).to.be.revertedWith(`NftMarketplace__ItemAlreadyListed("${basicIpfsNft.address}", ${TOKEN_ID})`);
                });
            });

            context("when user is not owner of an item", () => {
                beforeEach(async () => {
                    nftMarketplace = nftMarketplaceContract.connect(user);
                    await basicIpfsNft.approve(user.address, TOKEN_ID);
                });

                it("reverts transaction", async function () {
                    await expect(
                        nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, PRICE)
                    ).to.be.revertedWith("NftMarketplace__NotItemOwner");
                });
            });

            context("when item is not approved for marketplace", () => {
                beforeEach(async () => {
                    await basicIpfsNft.approve(ethers.constants.AddressZero, TOKEN_ID);
                });

                it("reverts transaction", async function () {
                    await expect(
                        nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, PRICE)
                    ).to.be.revertedWith("NftMarketplace__ItemNotApprovedForMarketplace");
                });
            });

            context("when price is 0", () => {
                const ZERO_PRICE = ethers.utils.parseEther("0");

                it("reverts transaction", async () => {
                    await expect(
                        nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, ZERO_PRICE)
                    ).to.be.revertedWith("NftMarketplace__ItemPriceMustBeAboveZero");
                });
            });
        });

        describe("cancelListing", function () {
            context("when item is not listed", () => {
                it("reverts transaction", async function () {
                    await expect(
                        nftMarketplace.cancelListing(basicIpfsNft.address, TOKEN_ID)
                    ).to.be.revertedWith(`NftMarketplace__ItemIsNotListed("${basicIpfsNft.address}", ${TOKEN_ID})`);
                });
            });

            context("when user is not owner", () => {
                beforeEach(async () => {
                    await nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, PRICE);
                    nftMarketplace = nftMarketplaceContract.connect(user);
                    await basicIpfsNft.approve(user.address, TOKEN_ID);
                });

                it("reverts transaction", async function () {
                    await expect(
                        nftMarketplace.cancelListing(basicIpfsNft.address, TOKEN_ID)
                    ).to.be.revertedWith("NftMarketplace__NotItemOwner");
                });
            });

            context("when item is listed and user is owner", () => {
                beforeEach(async () => {
                    await nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, PRICE);
                });

                it("emits event and removes listing", async function () {
                    expect(
                        await nftMarketplace.cancelListing(basicIpfsNft.address, TOKEN_ID)
                    ).to.emit("ItemCanceled");

                    const listing = await nftMarketplace.getListing(basicIpfsNft.address, TOKEN_ID);

                    expect(listing.price.toString()).to.eq("0");
                });
            });
        });

        describe("buyItem", function () {
            context("when item is listed and price is correct", () => {
                beforeEach(async () => {
                    await nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, PRICE);
                    nftMarketplace = nftMarketplaceContract.connect(user);
                });

                it("transfers the NFT to the buyer and updates internal proceeds record", async function () {
                    expect(
                        await nftMarketplace.buyItem(basicIpfsNft.address, TOKEN_ID, { value: PRICE })
                    ).to.emit("ItemBought");

                    const newOwner = await basicIpfsNft.ownerOf(TOKEN_ID);
                    const deployerProceeds = await nftMarketplace.getProceeds(deployer.address);

                    expect(newOwner.toString()).to.eq(user.address);
                    expect(deployerProceeds.toString()).to.eq(PRICE.toString());
                });
            });

            context("when item is not listed", () => {
                it("reverts transaction", async function () {
                    await expect(
                        nftMarketplace.buyItem(basicIpfsNft.address, TOKEN_ID)
                    ).to.be.revertedWith("NftMarketplace__ItemIsNotListed");
                });
            });

            context("when price is not correct", () => {
                beforeEach(async () => {
                    await nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, PRICE);
                });

                it("reverts transaction", async function () {
                    await expect(
                        nftMarketplace.buyItem(basicIpfsNft.address, TOKEN_ID)
                    ).to.be.revertedWith("NftMarketplace__PriceNotMet");
                });
            });
        })

        describe("updateListing", function () {
            context("when item is listed, user is owner and new price is greater then 0", () => {
                const updatedPrice = ethers.utils.parseEther("0.2");

                beforeEach(async () => {
                    await nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, PRICE);
                });

                it("reverts transaction", async function () {
                    expect(
                        await nftMarketplace.updateListing(basicIpfsNft.address, TOKEN_ID, updatedPrice)
                    ).to.emit("ItemListed");

                    const listing = await nftMarketplace.getListing(basicIpfsNft.address, TOKEN_ID);

                    expect(listing.price.toString()).to.eq(updatedPrice.toString());
                });
            });

            context("when item is not listed", () => {
                it("reverts transaction", async function () {
                    await expect(
                        nftMarketplace.updateListing(basicIpfsNft.address, TOKEN_ID, PRICE)
                    ).to.be.revertedWith("NftMarketplace__ItemIsNotListed");
                });
            });

            context("when user is not owner", () => {
                beforeEach(async () => {
                    await nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, PRICE);
                    nftMarketplace = nftMarketplaceContract.connect(user);
                });

                it("reverts transaction", async function () {
                    await expect(
                        nftMarketplace.updateListing(basicIpfsNft.address, TOKEN_ID, PRICE)
                    ).to.be.revertedWith("NftMarketplace__NotItemOwner");
                });
            });

            context("when new price is 0", () => {
                const updatedPrice = ethers.utils.parseEther("0");

                beforeEach(async () => {
                    await nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, PRICE);
                });

                it("reverts transaction", async function () {
                    await expect(
                        nftMarketplace.updateListing(basicIpfsNft.address, TOKEN_ID, updatedPrice)
                    ).to.be.revertedWith("NftMarketplace__ItemPriceMustBeAboveZero");
                });
            });
        });

        describe("withdrawProceeds", function () {
            context("when proceeds amount greater then 0", () => {
                beforeEach(async () => {
                    await nftMarketplace.listItem(basicIpfsNft.address, TOKEN_ID, PRICE);
                    nftMarketplace = nftMarketplaceContract.connect(user);
                    await nftMarketplace.buyItem(basicIpfsNft.address, TOKEN_ID, { value: PRICE });
                    nftMarketplace = nftMarketplaceContract.connect(deployer);
                });

                it("withdraws proceeds", async function () {
                    const deployerProceedsBefore = await nftMarketplace.getProceeds(deployer.address);
                    const deployerBalanceBefore = await deployer.getBalance();
                    const txResponse = await nftMarketplace.withdrawProceeds();
                    const transactionReceipt = await txResponse.wait(1);
                    const { gasUsed, effectiveGasPrice } = transactionReceipt;
                    const gasCost = gasUsed.mul(effectiveGasPrice);
                    const deployerBalanceAfter = await deployer.getBalance();

                    expect(
                        deployerBalanceAfter.add(gasCost).toString()
                    ).to.eq(deployerProceedsBefore.add(deployerBalanceBefore).toString());
                });
            });

            context("when proceeds amount is 0", () => {
                it("reverts transaction", async function () {
                    await expect(
                        nftMarketplace.withdrawProceeds()
                    ).to.be.revertedWith("NftMarketplace__NoProceeds");
                });
            });
        });
    });
