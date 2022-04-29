//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "../Provider.sol";

abstract contract IDEX is Provider {
    function swap(
        address _tokenIn,
        address _tokenOut,
        address _router,
        uint256 _amountIn,
        bytes calldata _data
    ) external payable virtual returns (uint256 amountOut);
}
