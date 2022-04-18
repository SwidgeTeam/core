import {ChainsAddresses} from "./scripts/addresses";

const addresses: ChainsAddresses = [
    {
        name: "hardhat",
        chainId: 31337,
        router: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        bridgeImplementations: [
            {
                code: 0,
                name: 'anyswap',
                address: '0x4f3aff3a747fcade12598081e80c6605a8be192f'
            }
        ],
        bridges: [
            {
                name: 'anyswap',
                address: '0x0123123123123123123123123123123123123123'
            }
        ],
        swapImplementations: [
            {
                name: 'uniswap',
                code: 0,
                address: '0x0123123123123123123123123123123123123123'
            }
        ],
        exchanges: [
            {
                name: 'uniswap',
                address: '0x0123123123123123123123123123123123123123'
            }
        ]
    },
    {
        name: "localhost",
        chainId: undefined,
        router: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
        bridgeImplementations: [
            {
                code: 0,
                name: 'anyswap',
                address: '0x4f3aff3a747fcade12598081e80c6605a8be192f'
            }
        ],
        bridges: [
            {
                name: 'anyswap',
                address: '0x0123123123123123123123123123123123123123'
            }
        ],
        swapImplementations: [
            {
                name: 'uniswap',
                code: 0,
                address: '0x0123123123123123123123123123123123123123'
            }
        ],
        exchanges: [
            {
                name: 'uniswap',
                address: '0x0123123123123123123123123123123123123123'
            }
        ]
    },
    {
        name: "matic",
        chainId: 137,
        router: '0x3cCcCcFaF090d8eD924833a8f155BeE2094b8B79',
        bridgeImplementations: [
            {
                code: 0,
                name: 'anyswap',
                address: '0xb95f4f9767F9C837dCab7F3956760350F16dD95E'
            }
        ],
        bridges: [
            {
                name: 'anyswap',
                address: '0x4f3aff3a747fcade12598081e80c6605a8be192f'
            }
        ],
        swapImplementations: [
            {
                code: 0,
                name: 'uniswap',
                address: '0xC2038d36865F2cFeA3be713946E7E13B296Aadf3'
            }
        ],
        exchanges: [
            {
                name: 'uniswap',
                address: '0xE592427A0AEce92De3Edee1F18E0157C05861564'
            }
        ]
    },
    {
        name: "mumbai",
        chainId: 80001,
        router: '0x698ef266230cD82BeD2E1f4Fdf3d53382499D93E',
        bridgeImplementations: [
            {
                code: 0,
                name: 'anyswap',
                address: '0x4f3aff3a747fcade12598081e80c6605a8be192f'
            }
        ],
        bridges: [
            {
                name: 'anyswap',
                address: '0x4f3aff3a747fcade12598081e80c6605a8be192f'
            }
        ],
        swapImplementations: [
            {
                name: 'uniswap',
                code: 0,
                address: '0x474A58cc1EE12B7911B957DFE07Bfc748Eb3CaBF'
            }
        ],
        exchanges: [
            {
                name: 'uniswap',
                address: '0xE592427A0AEce92De3Edee1F18E0157C05861564'
            }
        ]
    },
    {
        name: "fantom",
        chainId: 250,
        router: '0x3cCcCcFaF090d8eD924833a8f155BeE2094b8B79',
        bridgeImplementations: [
            {
                code: 0,
                name: 'anyswap',
                address: '0xb95f4f9767F9C837dCab7F3956760350F16dD95E'
            }
        ],
        bridges: [
            {
                name: 'anyswap',
                address: '0x1ccca1ce62c62f7be95d4a67722a8fdbed6eecb4'
            }
        ],
        swapImplementations: [
            {
                code: 0,
                name: 'uniswap',
                address: '0xC2038d36865F2cFeA3be713946E7E13B296Aadf3'
            }
        ],
        exchanges: [
            {
                name: 'uniswap',
                address: '0xE592427A0AEce92De3Edee1F18E0157C05861564'
            }
        ]
    },
];

export default addresses;