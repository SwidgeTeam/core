import {ethers} from "hardhat";
import chai, {expect} from "chai";
import {fakeTokenContract, RandomAddress, ZeroAddress} from "../shared";
import {Contract, ContractFactory} from "ethers";
import {smock} from "@defi-wonderland/smock";

chai.use(smock.matchers);

describe('ZeroEx', () => {
    let ZeroExFactory: ContractFactory;
    let contract: Contract;

    beforeEach(async () => {
        ZeroExFactory = await ethers.getContractFactory("ZeroEx");
        const [owner] = await ethers.getSigners();
        contract = await ZeroExFactory.connect(owner).deploy();
    });

    it("Should fail if anyone else than the owner tries to update the router address", async function () {
        /** Arrange */
        const [owner, anyoneElse, random] = await ethers.getSigners();
        contract = contract.connect(anyoneElse)

        /** Act */
        const call = contract.updateRouter(random.address)

        /** Assert */
        await expect(call).to.be.reverted;
    });

    it("Should fail if the new router address is ZeroAddress", async function () {
        /** Arrange */
        const [owner] = await ethers.getSigners();
        contract = contract.connect(owner);

        /** Act */
        const call = contract.updateRouter(ZeroAddress);

        /** Assert */
        await expect(call).to.be.reverted;
    });

    it("Should emit an event when the router is successfully updated", async function () {
        /** Arrange */
        const [owner, anyoneElse, random] = await ethers.getSigners();
        contract = contract.connect(owner);

        /** Act */
        const call = contract.updateRouter(random.address);

        /** Assert */
        await expect(call)
            .to.emit(contract, 'UpdatedRouter')
            .withArgs(ZeroAddress, random.address);
    });

    it("Should fail to execute if the caller is not the router", async function () {
        /** Arrange */
        const [owner, anyoneElse, router] = await ethers.getSigners();
        await contract.connect(owner)
            .updateRouter(router.address);
        contract = contract.connect(anyoneElse);

        /** Act */
        const call = contract.swap(
            RandomAddress,
            RandomAddress,
            router.address,
            1000000,
            '0x',
        );

        /** Assert */
        await expect(call).to.revertedWith('Unauthorized caller');
    });

    it("Should revert if provider fails the execution", async function () {
        /** Arrange */
        const [owner, anyoneElse, router] = await ethers.getSigners();
        await contract.connect(owner).updateRouter(router.address);

        // Create to fake ERC20 tokens
        const fakeTokenIn = await fakeTokenContract();
        const fakeTokenOut = await fakeTokenContract();

        // Create a fake contract
        const ABI = ['function testFunction() external'];
        const myFake = await smock.fake(ABI);

        // Fake a fail on the provider execution
        myFake.testFunction.returns(false);

        // Generate the encoded callData required to execute the function
        const callData = await encodedCalldata(ABI, 'testFunction', myFake.address);

        /** Act */
        const call = contract.connect(router).swap(
            fakeTokenIn.address,
            fakeTokenOut.address,
            router.address,
            1000000,
            callData,
        );

        /** Assert */
        await expect(call).to.be.reverted;
    });

    it("Should execute provider swap and return token to router", async function () {
        /** Arrange */
        const [owner, anyoneElse, router] = await ethers.getSigners();
        await contract.connect(owner).updateRouter(router.address);

        // Create two fake ERC20 tokens
        const fakeTokenIn = await fakeTokenContract();
        const fakeTokenOut = await fakeTokenContract();

        // Fake response from executed methods on the output token
        fakeTokenOut.balanceOf.returnsAtCall(0, 10);
        fakeTokenOut.balanceOf.returnsAtCall(1, 20);

        // Create a fake contract
        const ABI = ['function testFunction() external'];
        const myFake = await smock.fake(ABI);

        // Generate the encoded callData required to execute the function
        const callData = await encodedCalldata(ABI, 'testFunction', myFake.address);

        /** Act */
        await contract.connect(router).swap(
            fakeTokenIn.address,
            fakeTokenOut.address,
            router.address,
            1000000,
            callData,
        );

        /** Assert */
        expect(myFake.testFunction).to.have.been.calledOnce;
        expect(fakeTokenOut.transfer).to.have.been.calledOnceWith(router.address, 10);
    });

});

/**
 * Generates bytes of this data types:
 * (address, bytes)
 * The first address will be the invoked contract
 * The rest of the bytes are the callData for that contract (not relevant on this scope)
 * @param ABI
 * @param functionName
 * @param address
 */
async function encodedCalldata(
    ABI: string | ReadonlyArray<any>,
    functionName: string,
    address: string
) {
    const abiInterface = new ethers.utils.Interface(ABI);

    // Encode contract call address
    const encodedCallAddress = ethers.utils.defaultAbiCoder.encode(
        ['address'],
        [address]
    );

    // Encode contract call payload
    const encodedSelector = abiInterface.getSighash(functionName);
    const encodedArguments = ethers.utils.defaultAbiCoder.encode(
        ['uint256', 'uint256'],
        [10, 20]
    );

    // Pack bytes
    const encodedCallData = ethers.utils.hexConcat([encodedSelector, encodedArguments]);

    // Return payload
    return ethers.utils.hexConcat([encodedCallAddress, encodedCallData]);
}