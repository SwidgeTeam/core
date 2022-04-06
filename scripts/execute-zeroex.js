// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const hre = require("hardhat");
const {getChainAddresses} = require("./addresses");

async function main() {
    // Get user account
    const {user} = await hre.ethers.getNamedSigners();

    // Get deployed contract addresses
    const addresses = getChainAddresses(hre.network.config.chainId);

    const tokens = {
        USDC: {
            address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
            anyToken: '0xd69b31c3225728cc57ddaf9be532a4ee1620be51',
            decimals: 6
        },
        LINK: {
            address: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
            decimals: 18
        },
    };

    // Define function parameters
    const _srcToken = tokens.LINK;
    const _dstToken = tokens.USDC;
    const _srcAmount = ethers.utils.parseUnits('1', _srcToken.decimals);
    const _zeroExContract = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
    const _zeroExApproval = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
    const _data = '0x415565b000000000000000000000000053e0bca35ec356bd5dddfebbd1fc0fd03fabad390000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa841740000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000f395d500000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000005400000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000004a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000053e0bca35ec356bd5dddfebbd1fc0fd03fabad390000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000460000000000000000000000000000000000000000000000000000000000000046000000000000000000000000000000000000000000000000000000000000004200000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000024466796e0000000000000000000000000000000000000000000000000000000000000000000000000aacdb4f1e4cec480000000000000000000000000000000000000000000000000000000000bb6773000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000a102072a4c07f06ec3b4900fdc4c7b80b6c574290000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000053e0bca35ec356bd5dddfebbd1fc0fd03fabad390000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa84174000000000000000000000000000000024466796e0000000000000000000000000000000000000000000000000000000000000000000000000333db64891713b90000000000000000000000000000000000000000000000000000000000382e62000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000a102072a4c07f06ec3b4900fdc4c7b80b6c574290000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000300000000000000000000000053e0bca35ec356bd5dddfebbd1fc0fd03fabad390000000000000000000000007ceb23fd6bc0add59e62ac25578270cff1b9f6190000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa841740000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000053e0bca35ec356bd5dddfebbd1fc0fd03fabad39000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000000000000000000000b97dd29dc9624d8c76';

    // Approve user token to be taken by the router
    await approveTokens(_srcToken.address, addresses.router, _srcAmount, user);

    console.log('Tokens approved');

    // Get Proxy contract factory
    const Router = await hre.ethers.getContractAt(
        [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_srcToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_dstToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_srcAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "_zeroExMaker",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_zeroExApproval",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "_data",
                        "type": "bytes"
                    }
                ],
                "name": "initTokensCross",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ],
        addresses.router,
        user
    );

    // Execute function
    const tx = await Router.initTokensCross(
        _srcToken.address,
        _dstToken.address,
        _srcAmount,
        _zeroExContract,
        _zeroExApproval,
        _data,
        {
            gasPrice: 100000000000,
            gasLimit: 9000000
        }
    );

    console.log(tx);

    console.log('Done', await tx.wait());
}

async function approveTokens(tokenAddress, routerAddress, amount, signer) {
    // Get token contract factory
    const Token = await hre.ethers.getContractAt(
        [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    }, {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "name": "approve",
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ],
        tokenAddress,
        signer
    );

    const tx = await Token.approve(routerAddress, amount);

    console.log(tx);

    console.log('Done ', await tx.wait());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
