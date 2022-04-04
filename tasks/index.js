const {task} = require("hardhat/config")

task("accounts", "Prints the list of accounts")
    .setAction(require("./accounts"));

task("verify-bridge", "Verifies the contract of a bridge")
    .addParam('bridge', 'Name of the bridge contract to verify')
    .setAction(require('./verify-bridge'));

task("update-bridge-router", "Updated the router address on a bridge implementation")
    .addParam('bridge', 'Name of the bridge contract to update')
    .setAction(require('./update-bridge-router'));