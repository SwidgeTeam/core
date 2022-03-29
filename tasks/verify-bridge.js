const {getChainAddresses} = require("../scripts/addresses");

module.exports = async function (taskArguments, hre, runSuper) {
    const {network} = hre;
    const addresses = getChainAddresses(network.config.chainId)
    const bridgeName = taskArguments.bridge;
    const contractAddress = addresses.getBridgeImplAddress(bridgeName)
    const contractArgument = addresses.getBridgeAddress(bridgeName)

    await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [
            contractArgument
        ],
    });

    console.log('Bridge verified');
}