import {expect} from "chai";
import {ethers} from "hardhat";
import {RandomAddress, ZeroAddress} from "./variables";
import {Contract, ContractFactory} from "ethers";
import {getDeployMockContract} from "@nomiclabs/hardhat-waffle/dist/src/deploy";

describe("Router", function () {
    let RouterFactory: ContractFactory;
    let routerContract: Contract;

    beforeEach(async () => {
        RouterFactory = await ethers.getContractFactory("Router");
        const [owner] = await ethers.getSigners();
        routerContract = await RouterFactory.connect(owner).deploy();
    });

    describe('Update Events', () => {

        describe('Update Relayer', () => {
            it("Should fail if anyone else than the owner tries to update the relayer", async function () {
                const [owner, anyoneElse, random] = await ethers.getSigners();

                await expect(routerContract.connect(anyoneElse).updateRelayer(random.address))
                    .to.be.reverted;
            });

            it("Should fail if the new relayer address is ZeroAddress", async function () {
                const [owner] = await ethers.getSigners();

                await expect(routerContract.connect(owner).updateRelayer(ZeroAddress))
                    .to.be.reverted;
            });

            it("Should emit an event when the relayer is successfully updated", async function () {
                const [owner, anyoneElse, random] = await ethers.getSigners();

                await expect(routerContract.connect(owner).updateRelayer(random.address))
                    .to.emit(routerContract, 'UpdatedRelayer')
                    .withArgs(ZeroAddress, random.address);
            });
        });

        describe('Updated Bridge Provider', () => {
            it("Should fail if anyone else than the owner tries to update a bridge provider address", async function () {
                const [owner, anyoneElse, random] = await ethers.getSigners();

                await expect(routerContract.connect(anyoneElse).updateBridgeProvider(0, random.address))
                    .to.be.reverted;
            });

            it("Should fail if the new bridge provider address is ZeroAddress", async function () {
                const [owner] = await ethers.getSigners();

                await expect(routerContract.connect(owner).updateBridgeProvider(0, ZeroAddress))
                    .to.be.reverted;
            });

            it("Should emit an event when the bridge provider is successfully updated", async function () {
                const [owner, anyoneElse, random] = await ethers.getSigners();

                await expect(routerContract.connect(owner).updateBridgeProvider(0, random.address))
                    .to.emit(routerContract, 'UpdatedBridgeProvider')
                    .withArgs(0, random.address);
            });
        });

        describe('Updated Swap Provider', () => {
            it("Should fail if anyone else than the owner tries to update a swap provider address", async function () {
                const [owner, anyoneElse, random] = await ethers.getSigners();

                await expect(routerContract.connect(anyoneElse).updateSwapProvider(0, random.address))
                    .to.be.reverted;
            });

            it("Should fail if the new swap provider address is ZeroAddress", async function () {
                const [owner] = await ethers.getSigners();

                await expect(routerContract.connect(owner).updateSwapProvider(0, ZeroAddress))
                    .to.be.reverted;
            });

            it("Should emit an event when the swap provider is successfully updated", async function () {
                const [owner, anyoneElse, random] = await ethers.getSigners();

                await expect(routerContract.connect(owner).updateSwapProvider(0, random.address))
                    .to.emit(routerContract, 'UpdatedSwapProvider')
                    .withArgs(0, random.address);
            });
        });

    });

    describe('Swidge process', () => {
        it("Should revert if no swap nor bridge step is required", async function () {
            const [owner, anyoneElse] = await ethers.getSigners();
            const contract = routerContract.connect(anyoneElse);

            await expect(contract.initTokensCross(
                1000000,
                [
                    0,
                    RandomAddress,
                    RandomAddress,
                    '0x',
                    false
                ],
                [
                    RandomAddress,
                    57,
                    '0x',
                    false
                ],
                '0x'
            ))
                .to.be.revertedWith('No required actions');
        });
    });
});
