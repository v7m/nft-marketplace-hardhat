const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const fs = require("fs");

const FUND_AMOUNT = "1000000000000000000000";

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    svgShapes = [
        fs.readFileSync("./assets/images/blue.svg", { encoding: "utf8" }),
        fs.readFileSync("./assets/images/green.svg", { encoding: "utf8" }),
        fs.readFileSync("./assets/images/orange.svg", { encoding: "utf8" }),
        fs.readFileSync("./assets/images/red.svg", { encoding: "utf8" }),
    ]

    if (chainId == 31337) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait();
        vrfSubscriptionId = transactionReceipt.events[0].args.subId;
        await vrfCoordinatorV2Mock.fundSubscription(vrfSubscriptionId, FUND_AMOUNT);
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

    if (chainId == 31337) {
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
