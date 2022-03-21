const {getChainAddresses} = require("../scripts/addresses");

module.exports = async function (taskArguments, hre, runSuper) {
    const {ethers, network} = hre;
    const addresses = getChainAddresses(network.config.chainId)
    const {admin} = await ethers.getNamedSigners();
    const ProxyAdmin = await ethers.getContractFactory('ProxyAdmin', admin);
    const contract = await ProxyAdmin.attach(addresses.proxyAdmin)
    await contract.upgrade(addresses.routerProxy, addresses.router);

    console.log('Proxy updated');
}