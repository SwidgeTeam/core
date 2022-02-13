import "dotenv/config"
import "@nomiclabs/hardhat-waffle";
import "./tasks/index"

import {HardhatUserConfig} from "hardhat/types"

const config: HardhatUserConfig = {
    solidity: "0.8.1",
};

export default config;
