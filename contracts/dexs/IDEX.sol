//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IDEX {
    function swap(address _token, uint256 _amount) external;
}

