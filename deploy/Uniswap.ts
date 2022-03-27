import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {getChainAddresses} from "../scripts/addresses";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts, network} = hre;
    const {deploy} = deployments;
    const addresses = getChainAddresses(<any>network.config.chainId);

    const {deployer} = await getNamedAccounts();

    await deploy('Uniswap', {
        from: deployer,
        args: [
            addresses.getExchangeAddress('uniswap')
        ],
        log: true,
    });

};
export default func;
func.tags = ["uniswap"]
