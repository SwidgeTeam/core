const addresses = [
    {
        name: "hardhat",
        chainId: 31337,
        proxyAdmin: '0x8464135c8F25Da09e49BC8782676a84730C318bC',
        router: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        routerProxy: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
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
        router: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
        routerProxy: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
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
        router: '',
        routerProxy: '',
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
];

export default addresses;