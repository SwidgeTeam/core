//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "./IDEX.sol";

contract UniswapDEX is IDEX {
    ISwapRouter public immutable swapRouter;

    // Set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    constructor(address _swapRouterAddress) {
        swapRouter = ISwapRouter(_swapRouterAddress);
    }

    function custodianAddress() external view override returns (address) {
        return address(swapRouter);
    }

    function swap(address _tokenIn, address _tokenOut, address _recipient, uint256 _amountIn) external override returns (uint256 amountOut) {
        // This functions requires the owner to already have allowed the provider to take the tokens
        uint256 amountAllowed = IERC20(_tokenIn).allowance(_recipient, address(swapRouter));
        require(amountAllowed == _amountIn, "SWAP: Swap provider not allowed.");

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
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
        amountOut = swapRouter.exactInputSingle(params);
    }
}
