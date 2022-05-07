// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const hre = require("hardhat");
const {getChainAddresses} = require("./addresses");

async function main() {
    // Get user account
    const {deployer} = await hre.ethers.getNamedSigners();

    // Get deployed contract addresses
    const addresses = getChainAddresses(hre.network.config.chainId);

    // Get Proxy contract factory
    const Router = await hre.ethers.getContractAt(
        [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_token",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    }
                ],
                "name": "retrieve",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ],
        addresses.router,
        deployer
    );

    const token = '';
    const amount = '';

    // Execute function
    const tx = await Router.retrieve(
        token,
        amount,
        {
            gasPrice: 100000000000,
            gasLimit: 9000000
        }
    );

    console.log(tx);

    console.log('Done', await tx.wait());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
