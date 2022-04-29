const {getChainAddresses} = require("../scripts/addresses");

module.exports = async function (taskArguments, hre, runSuper) {
    const {network} = hre;
    const addresses = getChainAddresses(network.config.chainId);
    const routerAddress = addresses.router;

    await hre.run("verify:verify", {
        address: routerAddress,
        constructorArguments: [],
    });

    console.log('Router verified');
}