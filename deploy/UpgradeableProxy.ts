import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;

    const {deployer} = await getNamedAccounts();

    const address_logic = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
    const address_admin = '0x8464135c8F25Da09e49BC8782676a84730C318bC';

    await deploy('UpgradeableProxy', {
        from: deployer,
        args: [address_logic, address_admin],
        log: true,
    });

};
export default func;
func.tags = ["proxy"]
