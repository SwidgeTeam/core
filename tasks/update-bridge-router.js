const {getChainAddresses} = require("../scripts/addresses");

module.exports = async function (taskArguments, hre, runSuper) {
    const {ethers, network} = hre;
    const addresses = getChainAddresses(network.config.chainId)
    const {deployer} = await ethers.getNamedSigners();
    const bridgeName = taskArguments.bridge;
    const contractName = getContractName(bridgeName);
    const bridgeContractFactory = await ethers.getContractFactory(contractName, deployer);
    const contractAddress = addresses.getBridgeImplAddress(bridgeName);
    const contract = await bridgeContractFactory.attach(contractAddress);
    await contract.updateRouter(addresses.router);

    console.log('Address updated');
}

function getContractName(name) {
    switch (name) {
        case 'anyswap':
            return 'Anyswap';
        default:
            throw new Error('Unkown bridge');
    }
}