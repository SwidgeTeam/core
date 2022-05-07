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
            address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
            decimals: 6
        },
        SUSHI: {
            address: '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC',
            decimals: 18
        },
    };

    // Define function parameters
    const _srcToken = tokens.USDC;
    const _dstToken = tokens.SUSHI;
    //const _srcAmount = ethers.utils.parseUnits('13', _srcToken.decimals);
    const _srcAmount = '13000000';
    const _receiver = '0x7228ebf7C311e82867F08Ad6Dd3FCfbC2adB41A9';

    const _data = '0x000000000000000000000000def189deaef76e379df891899eb5a00a94cbc250415565b000000000000000000000000004068da6c83afcfa0e13ba15a6696662335d5b75000000000000000000000000ae75a438b2e0cb8bb01ec1e1e376de11d44477cc0000000000000000000000000000000000000000000000000000000000c65d400000000000000000000000000000000000000000000000004f8fb52b9819176800000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003c00000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004068da6c83afcfa0e13ba15a6696662335d5b75000000000000000000000000ae75a438b2e0cb8bb01ec1e1e376de11d44477cc000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000000002c00000000000000000000000000000000000000000000000000000000000c65d4000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000002537573686953776170000000000000000000000000000000000000000000000000000000000000000000000000c65d400000000000000000000000000000000000000000000000004f8fb52b98191768000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000001b02da8cb0d097eb8d57a175b88c7d8b479975060000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000300000000000000000000000004068da6c83afcfa0e13ba15a6696662335d5b7500000000000000000000000021be370d5312f44cb42ce377bc9b8a0cef1a4c83000000000000000000000000ae75a438b2e0cb8bb01ec1e1e376de11d44477cc000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000004068da6c83afcfa0e13ba15a6696662335d5b75000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd0000000000000000000000001000000000000000000000000000000000000011000000000000000000000000000000000000000000000087e185c17362765365';

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
                        "internalType": "address",
                        "name": "_receiver",
                        "type": "address"
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
                        "internalType": "string",
                        "name": "_txUuid",
                        "type": "string"
                    }
                ],
                "name": "finalizeTokenCross",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            }
        ],
        addresses.router,
        user
    );

    const uuid = ethers.utils.defaultAbiCoder.encode(['uint256'], ['5656']);

    console.log(1);

    const feeData = await hre.ethers.provider.getFeeData();

    // Execute function
    const tx = await Router.finalizeTokenCross(
        _srcAmount,
        _receiver,
        [
            1,
            _srcToken.address,
            _dstToken.address,
            _data,
            true
        ],
        uuid,
        {
            gasPrice: feeData.gasPrice,
            gasLimit: 9000000
        }
    );
    console.log(2);

    console.log(tx.hash);

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
