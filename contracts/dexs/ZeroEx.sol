//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "./IDEX.sol";

contract ZeroEx is IDEX {
    function swap(
        address _tokenIn,
        address _tokenOut,
        address _router,
        uint256 _amountIn,
        bytes calldata _data
    ) external payable override onlyRouter returns (uint256 boughtAmount) {
        TransferHelper.safeTransferFrom(_tokenIn, _router, address(this), _amountIn);

        (address callAddress, bytes memory callData) = abi.decode(_data, (address, bytes));

        TransferHelper.safeApprove(_tokenIn, callAddress, _amountIn);

        // Execute swap with ZeroEx and compute final `boughtAmount`
        boughtAmount = IERC20(_tokenOut).balanceOf(address(this));
        (bool success,) = callAddress.call{value : msg.value}(callData);
        require(success, "SWAP FAILED");
        boughtAmount = IERC20(_tokenOut).balanceOf(address(this)) - boughtAmount;

        TransferHelper.safeTransfer(_tokenOut, _router, boughtAmount);
    }
}
