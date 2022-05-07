const {getChainAddresses} = require("../scripts/addresses");

module.exports = async function (taskArguments, hre, runSuper) {
    const {ethers, network} = hre;
    const addresses = getChainAddresses(network.config.chainId)
    const {deployer} = await ethers.getNamedSigners();
    const routerFactory = await ethers.getContractFactory('Router', deployer);
    const contract = await routerFactory.attach(addresses.router);
    await contract.updateRelayer('0x88db1f1277645528FA0a1d0d436c546378e74D0C');

    console.log('Relayer address updated');
}
