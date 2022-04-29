const {task} = require("hardhat/config")

task("accounts", "Prints the list of accounts")
    .setAction(require("./accounts"));

task("verify-bridge", "Verifies the contract of a bridge")
    .addParam('bridge', 'Name of the bridge contract to verify')
    .setAction(require('./verify-bridge'));

task("verify-router", "Verifies the router contract")
    .setAction(require('./verify-router'));

task("update-bridge-router", "Updated the router address on a bridge implementation")
    .addParam('bridge', 'Name of the bridge contract to update')
    .setAction(require('./update-bridge-router'));

task("update-swapper-router", "Updated the router address on a swapper implementation")
    .addParam('swapper', 'Name of the swapper contract to update')
    .setAction(require('./update-swapper-router'));
