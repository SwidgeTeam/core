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
    const _srcToken = tokens.USDC;
    const _srcCrossToken = tokens.LINK;
    const _dstCrossToken = '0x0000000000000000000000000000000000000000'; // unused
    const _dstToken = '0x0000000000000000000000000000000000000000'; // unused
    const _srcAmount = ethers.utils.parseUnits('16', _srcToken.decimals);
    const _toChainId = 56; // BSC
    const _bridge = 0; // unused
    const _srcDEX = 0;
    const _dstDEX = 0; // unused

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
                        "name": "_srcCrossToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "_dstCrossToken",
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
                        "internalType": "uint256",
                        "name": "_toChainId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint8",
                        "name": "_bridge",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "_srcDEX",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "_dstDEX",
                        "type": "uint8"
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

    const feeData = await Router.provider.getFeeData();

    console.log(feeData);

    // Execute function
    const tx = await Router.initTokensCross(
        _srcToken.address,
        _srcCrossToken.address,
        _dstCrossToken,
        _dstToken,
        _srcAmount,
        _toChainId,
        _bridge,
        _srcDEX,
        _dstDEX,
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
