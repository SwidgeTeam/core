const addresses = [
    {
        name: "hardhat",
        chainId: 31337,
        proxyAdmin: '0x8464135c8F25Da09e49BC8782676a84730C318bC',
        routerProxy: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
        router: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        bridges: [
            {
                name: 'anyswap',
                address: '0x0123123123123123123123123123123123123123'
            }
        ],
        swappers: [
            {
                name: 'uni',
                code: 0,
                address: '0x0123123123123123123123123123123123123123'
            },
        ]
    },
    {
        name: "localhost",
        chainId: undefined,
        proxyAdmin: '0x8464135c8F25Da09e49BC8782676a84730C318bC',
        routerProxy: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
        router: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
        bridges: [
            {
                name: 'anyswap',
                address: '0x0123123123123123123123123123123123123123'
            }
        ],
        swappers: [
            {
                name: 'uni',
                code: 0,
                address: '0x0123123123123123123123123123123123123123'
            },
        ]
    },
    {
        name: "rinkeby",
        chainId: 4,
        proxyAdmin: '0x8464135c8F25Da09e49BC8782676a84730C318bC',
        routerProxy: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
        router: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        bridges: [
            {
                name: 'anyswap',
                address: '0x95dD59343a893637BE1c3228060EE6afBf6F0730'
            }
        ],
        swappers: [
            {
                name: 'uni',
                code: 0,
                address: '0xE592427A0AEce92De3Edee1F18E0157C05861564'
            },
        ]
    },
    {
        name: "matic",
        chainId: 137,
        proxyAdmin: '0xB53FE327A78A88BdB89f99e82BDbb741311c15F8',
        routerProxy: '0xdd700e687d8b9482fF012e91894B7d0A69A279ce',
        router: '0x698ef266230cD82BeD2E1f4Fdf3d53382499D93E',
        bridges: [
            {
                name: 'anyswap',
                address: '0x4f3aff3a747fcade12598081e80c6605a8be192f'
            }
        ],
        swappers: [
            {
                name: 'uni',
                code: 0,
                address: '0xE592427A0AEce92De3Edee1F18E0157C05861564'
            },
        ]
    },
    {
        name: "mumbai",
        chainId: 80001,
        proxyAdmin: '0xB53FE327A78A88BdB89f99e82BDbb741311c15F8',
        routerProxy: '0xdd700e687d8b9482fF012e91894B7d0A69A279ce',
        router: '0x698ef266230cD82BeD2E1f4Fdf3d53382499D93E',
        bridges: [
            {
                name: 'anyswap',
                address: '0x4f3aff3a747fcade12598081e80c6605a8be192f'
            }
        ],
        swappers: [
            {
                name: 'uni',
                code: 0,
                address: '0xE592427A0AEce92De3Edee1F18E0157C05861564'
            },
        ]
    },
];

export default addresses;