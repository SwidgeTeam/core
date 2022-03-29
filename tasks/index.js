const {task} = require("hardhat/config")

task("accounts", "Prints the list of accounts")
    .setAction(require("./accounts"));

task("update-proxy", "Updates implementation logic address on a proxy")
    .setAction(require('./update-proxy'));

task("verify-bridge", "Verifies the contract of a bridge")
    .addParam('bridge', 'Name of the bridge contract to verify')
    .setAction(require('./verify-bridge'));