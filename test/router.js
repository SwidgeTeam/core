const {expect} = require("chai");
const {ethers} = require("hardhat");
const {ZeroAddress} = require("./variables");

describe("Router", function () {
    let RouterFactory;
    let routerContract;

    beforeEach(async () => {
        RouterFactory = await ethers.getContractFactory("Router");
        const [owner] = await ethers.getSigners();
        routerContract = await RouterFactory.connect(owner).deploy();
    });

    it("Should fail if anyone else than the owner tries to update the relayer", async function () {
        const [owner, anyoneElse, random] = await ethers.getSigners();

        expect(routerContract.connect(anyoneElse).updateRelayer(random.address))
            .to.be.reverted;
    });

    it("Should fail if the new relayer address is ZeroAddress", async function () {
        const [owner] = await ethers.getSigners();

        expect(routerContract.connect(owner).updateRelayer(ZeroAddress))
            .to.be.reverted;
    });

    it("Should emit an event when the relayer is successfully updated", async function () {
        const [owner, anyoneElse, random] = await ethers.getSigners();

        expect(await routerContract.connect(owner).updateRelayer(random.address))
            .to.emit(routerContract, 'UpdatedRelayer')
            .withArgs(ZeroAddress, random.address);
    });
});
