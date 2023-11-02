const { network } = require("hardhat");

const VRF_BASE_FEE = "250000000000000000";
const VRF_GAS_PRICE_LINK = 1e9;

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...");
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [VRF_BASE_FEE, VRF_GAS_PRICE_LINK],
        });

        log("----------------------------------------------------------");
        log("Mocks Deployed!");
        log("----------------------------------------------------------");
    }
}
module.exports.tags = ["all", "mocks", "main"];
