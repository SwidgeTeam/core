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
        // Extract the contract address from the bytes
        (address payable callAddress) = abi.decode(_data, (address));

        // Remove the first 32 bytes(an address)
        // to have the correct callData for the provider contract
        bytes memory callData = _data[32 :];

        uint256 valueToSend;
        // Check how much value we need to forward
        if (_tokenIn == NATIVE_TOKEN_ADDRESS) {
            valueToSend = _amountIn;
        }
        else {
            // Take the tokens from the router
            TransferHelper.safeTransferFrom(_tokenIn, _router, address(this), _amountIn);
            // Approve tokens to the provider contract
            TransferHelper.safeApprove(_tokenIn, callAddress, _amountIn);
        }


        // Execute swap with ZeroEx and compute final `boughtAmount`
        boughtAmount = IERC20(_tokenOut).balanceOf(address(this));
        (bool success,) = callAddress.call{value : valueToSend}(callData);
        require(success, "SWAP FAILED");
        boughtAmount = IERC20(_tokenOut).balanceOf(address(this)) - boughtAmount;

        // Send tokens back to the router
        TransferHelper.safeTransfer(_tokenOut, _router, boughtAmount);
    }

}
