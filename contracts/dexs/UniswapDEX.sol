//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IDEX.sol";

contract UniswapDEX is IDEX {

    address uniswapAddress;

    constructor(address _address){
        uniswapAddress = _address;
    }

    function swap(address _token, uint256 _amount) external override {

    }
}
