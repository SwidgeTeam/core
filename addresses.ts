const addresses = [
    {
        name: "hardhat",
        chainId: 31337,
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