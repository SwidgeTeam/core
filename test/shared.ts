import {smock} from "@defi-wonderland/smock";

export const ZeroAddress = '0x0000000000000000000000000000000000000000';
export const RandomAddress = '0x1231231231231231321231231231231231231231';


export interface TokenContractResponses {
    balanceOf?: boolean;
    approve?: boolean;
    transfer?: boolean;
    transferFrom?: boolean;
}

/**
 * Instantiates a new ERC20 token fake contract
 * @param responses Allows to config the response values of the different methods
 */
export async function fakeTokenContract(responses?: TokenContractResponses) {
    const tokenAbi = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint)",
        "function approve(address spender, uint256 value) returns (bool)",
        "function transferFrom(address _from, address _to, uint256 _value) returns (bool)",
        "function transfer(address _to, uint256 _value) returns (bool)",
        "event Transfer(address indexed from, address indexed to, uint amount)"
    ];
    const fake = await smock.fake(tokenAbi);

    if (responses === undefined) responses = {};

    responses.balanceOf = responses.balanceOf === undefined ? true : responses.balanceOf;
    responses.approve = responses.approve === undefined ? true : responses.approve;
    responses.transfer = responses.transfer === undefined ? true : responses.transfer;
    responses.transferFrom = responses.transferFrom === undefined ? true : responses.transferFrom;

    fake.balanceOf.returns(responses.balanceOf);
    fake.approve.returns(responses.approve);
    fake.transfer.returns(responses.transfer);
    fake.transferFrom.returns(responses.transferFrom);

    return fake;
}
