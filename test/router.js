const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Router", function () {
    let RouterFactory;

    beforeEach(async () => {
        RouterFactory = await ethers.getContractFactory("RouterForwarder");
    });

    it("Should fail if DEX data is unbalanced", async function () {
        const [bridge, dex1] = await ethers.getSigners();

        await expect(RouterFactory.deploy(bridge.address, [dex1.address], []))
            .to.be.revertedWith('INIT: Addresses count mismatch codes count.');

        await expect(RouterFactory.deploy(bridge.address, [dex1.address], [0, 0]))
            .to.be.revertedWith('INIT: Addresses count mismatch codes count.');
    });

    it("Should fail if no DEX data is informed", async function () {
        const [bridge, dex1] = await ethers.getSigners();

        await expect(RouterFactory.deploy(bridge.address, [], []))
            .to.be.revertedWith('INIT: No swap providers informed.');
    });

    it("Should fail if DEX code is unknown", async function () {
        const [bridge, dex1] = await ethers.getSigners();

        await expect(RouterFactory.deploy(bridge.address, [dex1.address], [999]))
            .to.be.reverted
    });

});
