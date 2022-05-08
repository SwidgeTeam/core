const {task} = require("hardhat/config")

task("accounts", "Prints the list of accounts")
    .setAction(require("./accounts"));

task("verify-router", "Verifies the router contract")
    .setAction(require('./verify-router'));