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
    const _srcAmount = ethers.utils.parseUnits('1.3', _srcToken.decimals);
    //const _srcAmount = '1300000000000000000';
    const _data = '0x000000000000000000000000def1c0ded9bec7f1a1670819833240f027b25eff415565b000000000000000000000000053e0bca35ec356bd5dddfebbd1fc0fd03fabad390000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa84174000000000000000000000000000000000000000000000000120a871cc00200000000000000000000000000000000000000000000000000000000000000d5077c00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003400000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000002a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000053e0bca35ec356bd5dddfebbd1fc0fd03fabad390000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa841740000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000002600000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000120a871cc00200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000001142616c616e6365725632000000000000000000000000000000000000000000000000000000000000120a871cc00200000000000000000000000000000000000000000000000000000000000000d5077c00000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000040000000000000000000000000ba12222222228d8ba445958a75a0704d566bf2c836128d5436d2d70cab39c9af9cce146c38554ff0000100000000000000000008000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000053e0bca35ec356bd5dddfebbd1fc0fd03fabad39000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000000000000000000000b21e1949f76274f4fc';

    //const _bridgeOut = '0x04068da6c83afcfa0e13ba15a6696662335d5b75';
    const _bridgeIn = _dstToken.address;
    const _bridgeToChainId = '250';
    const _bridgeData = '0x000000000000000000000000d69b31c3225728cc57ddaf9be532a4ee1620be51';

    // Approve user token to be taken by the router
    await approveTokens(_srcToken.address, addresses.router, _srcAmount, user);

    console.log('Tokens approved');

    // Get Proxy contract factory
    const Router = await hre.ethers.getContractAt(
        [
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint8",
                                "name": "providerCode",
                                "type": "uint8"
                            },
                            {
                                "internalType": "address",
                                "name": "tokenIn",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "tokenOut",
                                "type": "address"
                            },
                            {
                                "internalType": "bytes",
                                "name": "data",
                                "type": "bytes"
                            },
                            {
                                "internalType": "bool",
                                "name": "required",
                                "type": "bool"
                            }
                        ],
                        "internalType": "struct Router.SwapData",
                        "name": "_swapData",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "tokenIn",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "toChainId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bytes",
                                "name": "data",
                                "type": "bytes"
                            },
                            {
                                "internalType": "bool",
                                "name": "required",
                                "type": "bool"
                            }
                        ],
                        "internalType": "struct Router.BridgeData",
                        "name": "_bridgeData",
                        "type": "tuple"
                    },
                    {
                        "internalType": "bytes",
                        "name": "_txUuid",
                        "type": "bytes"
                    }
                ],
                "name": "initTokensCross",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            }
        ],
        addresses.router,
        user
    );

    const uuid = ethers.utils.defaultAbiCoder.encode(['uint256'], ['5656']);

    const feeData = await hre.ethers.provider.getFeeData();

    // Execute function
    const tx = await Router.initTokensCross(
        _srcAmount,
        [
            1,
            _srcToken.address,
            _dstToken.address,
            _data,
            true
        ],
        [
            _bridgeIn,
            _bridgeToChainId,
            _bridgeData,
            true
        ],
        uuid,
        {
            gasPrice: feeData.gasPrice,
            gasLimit: 9000000
        }
    );

    console.log(tx.hash);

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
