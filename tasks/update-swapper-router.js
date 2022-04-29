const {getChainAddresses} = require("../scripts/addresses");

module.exports = async function (taskArguments, hre, runSuper) {
    const {ethers, network} = hre;
    const addresses = getChainAddresses(network.config.chainId)
    const {deployer} = await ethers.getNamedSigners();
    const swapperName = taskArguments.swapper;
    const contractName = getContractName(swapperName);
    const swapContractFactory = await ethers.getContractFactory(contractName, deployer);
    const contractAddress = addresses.getSwapperImplAddress(swapperName);
    const contract = await swapContractFactory.attach(contractAddress);
    await contract.updateRouter(addresses.router);

    console.log('Address updated');
}

function getContractName(name) {
    switch (name) {
        case 'uniswap':
            return 'Uniswap';
        case 'zeroex':
            return 'ZeroEx';
        default:
            throw new Error('Unkown swapper');
    }
}