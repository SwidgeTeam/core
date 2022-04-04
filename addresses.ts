import {ChainsAddresses} from "./scripts/addresses";

const addresses: ChainsAddresses = [
    {
        name: "hardhat",
        chainId: 31337,
        proxyAdmin: '0x8464135c8F25Da09e49BC8782676a84730C318bC',
        routerProxy: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
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
        proxyAdmin: '0x8464135c8F25Da09e49BC8782676a84730C318bC',
        routerProxy: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
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
        proxyAdmin: '0xB53FE327A78A88BdB89f99e82BDbb741311c15F8',
        routerProxy: '0xdd700e687d8b9482fF012e91894B7d0A69A279ce',
        router: '0x1b42b12e3d6117a012310FAb8AC380ce50d1Cf37',
        bridgeImplementations: [
            {
                code: 0,
                name: 'anyswap',
                address: '0x3d08265f9ad4E0357c6919572fc7A816B0B6C43E'
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
        proxyAdmin: '0xB53FE327A78A88BdB89f99e82BDbb741311c15F8',
        routerProxy: '0xdd700e687d8b9482fF012e91894B7d0A69A279ce',
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
        proxyAdmin: '0xB53FE327A78A88BdB89f99e82BDbb741311c15F8',
        routerProxy: '0xdd700e687d8b9482fF012e91894B7d0A69A279ce',
        router: '0x698ef266230cD82BeD2E1f4Fdf3d53382499D93E',
        bridgeImplementations: [
            {
                code: 0,
                name: 'anyswap',
                address: '0x3d08265f9ad4E0357c6919572fc7A816B0B6C43E'
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
];

export default addresses;