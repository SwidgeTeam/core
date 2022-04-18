const {getChainAddresses} = require("../scripts/addresses");

module.exports = async function (taskArguments, hre, runSuper) {
    const {network} = hre;
    const addresses = getChainAddresses(network.config.chainId);
    const routerAddress = addresses.router;
    const bridgeImplAddresses = addresses.getAllBridgeImplAddresses;

    await hre.run("verify:verify", {
        address: routerAddress,
        constructorArguments: [
            bridgeImplAddresses
        ],
    });

    console.log('Router verified');
}