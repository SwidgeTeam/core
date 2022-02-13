module.exports = async function (taskArguments, hre, runSuper) {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
}