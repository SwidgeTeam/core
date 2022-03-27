//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "./IDEX.sol";

contract Uniswap is IDEX {
    address private swapRouterAddress;

    // Set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    constructor(address _swapRouterAddress) {
        swapRouterAddress = _swapRouterAddress;
    }

    function custodianAddress() external view override returns (address) {
        return swapRouterAddress;
    }

    function swap(
        address _tokenIn,
        address _tokenOut,
        address _recipient,
        uint256 _amountIn
    ) external override returns (uint256 amountOut) {
        TransferHelper.safeTransferFrom(_tokenIn, _recipient, address(this), _amountIn);
        TransferHelper.safeApprove(_tokenIn, swapRouterAddress, _amountIn);

        // Set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn : _tokenIn,
            tokenOut : _tokenOut,
            fee : poolFee,
            recipient : _recipient,
            deadline : block.timestamp,
            amountIn : _amountIn,
            amountOutMinimum : 0, // TODO : needs to be either be asked to oracle or passed as parameter
            sqrtPriceLimitX96 : 0
        });

        // The call to `exactInputSingle` executes the swap.
        amountOut = ISwapRouter(swapRouterAddress).exactInputSingle(params);
    }
}
