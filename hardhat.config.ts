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
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            forking: {
                enabled: process.env.FORKING === "true",
                url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
            },
            live: false,
            saveDeployments: true,
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts,
            chainId: 4,
            live: true,
            saveDeployments: true,
            tags: ["staging"],
            gasPrice: 5000000000,
            gasMultiplier: 2,
        },
    }
};

export default config;
