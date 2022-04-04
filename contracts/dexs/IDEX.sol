//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IDEX {

    function custodianAddress() external view returns (address);

    function swap(
        address _tokenIn,
        address _tokenOut,
        address _from,
        address _to,
        uint256 _amountIn,
        bytes calldata _data
    ) external returns (uint256 amountOut);

}

