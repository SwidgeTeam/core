import "dotenv/config"
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "./tasks/index"

import {HardhatUserConfig} from "hardhat/types"

const accounts = {
    mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk",
}

const config: HardhatUserConfig = {
    solidity: "0.8.1",
    namedAccounts: {
        deployer: {
            default: 0,
        },
        admin: {
            default: 1,
        },
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            forking: {
                enabled: process.env.FORKING === "true",
                url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
            },
            live: false,
            saveDeployments: false,
        },
        localhost: {
            url: 'http://127.0.0.1:8545',
            live: false,
            saveDeployments: false,
        },
        ropsten: {
            url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts,
            chainId: 3,
            live: true,
            saveDeployments: true,
            gasPrice: 5000000000,
            gasMultiplier: 2,
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts,
            chainId: 4,
            live: true,
            saveDeployments: true,
            gasPrice: 5000000000,
            gasMultiplier: 2,
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts,
            chainId: 5,
            live: true,
            saveDeployments: true,
            gasPrice: 5000000000,
            gasMultiplier: 2,
        },
        kovan: {
            url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts,
            chainId: 42,
            live: true,
            saveDeployments: true,
            gasPrice: 20000000000,
            gasMultiplier: 2,
        },
        "bsc-testnet": {
            url: "https://data-seed-prebsc-2-s3.binance.org:8545",
            accounts,
            chainId: 97,
            live: true,
            saveDeployments: true,
            tags: ["staging"],
            gasMultiplier: 2,
        },
        matic: {
            url: "https://rpc-mainnet.maticvigil.com",
            accounts,
            chainId: 137,
            live: true,
            saveDeployments: true,
        },
        mumbai: {
            url: "https://rpc-mumbai.maticvigil.com/",
            accounts,
            chainId: 80001,
            live: true,
            saveDeployments: true,
            gasMultiplier: 2,
        },
    }
};

export default config;
