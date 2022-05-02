const {getChainAddresses} = require("../scripts/addresses");

module.exports = async function (taskArguments, hre, runSuper) {
    const {ethers, network} = hre;
    const addresses = getChainAddresses(network.config.chainId)
    const {deployer} = await ethers.getNamedSigners();
    const routerFactory = await ethers.getContractFactory('Router', deployer);
    const contract = await routerFactory.attach(addresses.router);

    // Set anyswap
    for (const bridge of addresses.getAllBridgeImpl) {
        console.log(bridge);
        await contract.updateBridgeProvider(bridge.code, bridge.address);
    }

    for (const swapper of addresses.getAllSwapperImpl) {
        console.log(swapper);
        await contract.updateSwapProvider(swapper.code, swapper.address);
    }

    console.log('Router updated');
}