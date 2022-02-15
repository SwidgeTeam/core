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
    }
};

export default config;
