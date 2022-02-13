//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IDEX {

    function custodianAddress() external view returns (address);

    function swap(address _tokenIn, address _tokenOut, address _recipient, uint256 _amountIn) external returns (uint256 amountOut);

}

