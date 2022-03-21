const {task} = require("hardhat/config")

task("accounts", "Prints the list of accounts")
    .setAction(require("./accounts"));

task("update-proxy", "Updates implementation logic address on a proxy")
    .setAction(require('./update-proxy'));