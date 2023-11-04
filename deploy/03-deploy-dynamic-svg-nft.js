const { network, ethers } = require("hardhat");
const { chainIds, networkConfig, developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const fs = require("fs");

const VRF_FUND_AMOUNT = ethers.utils.parseEther("1"); // 1 ETH

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let vrfCoordinatorV2Address, vrfSubscriptionId, vrfCoordinatorV2Mock;

    svgShapes = [
        fs.readFileSync("./assets/images/blue.svg", { encoding: "utf8" }),
        fs.readFileSync("./assets/images/green.svg", { encoding: "utf8" }),
        fs.readFileSync("./assets/images/orange.svg", { encoding: "utf8" }),
        fs.readFileSync("./assets/images/red.svg", { encoding: "utf8" }),
    ]

    if (chainId == chainIds["localhost"]) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait();
        vrfSubscriptionId = transactionReceipt.events[0].args.subId;
        await vrfCoordinatorV2Mock.fundSubscription(vrfSubscriptionId, VRF_FUND_AMOUNT);
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
        vrfSubscriptionId = networkConfig[chainId].vrfSubscriptionId;
    }

    log("----------------------------------------------------");

    arguments = [
        vrfCoordinatorV2Address,
        vrfSubscriptionId,
        networkConfig[chainId]["vrfGasLane"],
        networkConfig[chainId]["vrfCallbackGasLimit"],
        networkConfig[chainId]["mintFee"],
        svgShapes
    ];

    const dynamicSvgNft = await deploy("DynamicSvgNft", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        await vrfCoordinatorV2Mock.addConsumer(vrfSubscriptionId, dynamicSvgNft.address);
    }

    log("----------------------------------------------------------");
    log("DynamicSvgNft contract deployed!");
    log("----------------------------------------------------------");

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(dynamicSvgNft.address, arguments);
    }
}

module.exports.tags = ["all", "dynamicSvgNft", "main"];
