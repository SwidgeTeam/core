//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

interface AnyswapRouter {
    function anySwapOutUnderlying(address token, address to, uint amount, uint toChainID) external;
}

interface AnyswapCallProxy {
    function anyCall(address _to, bytes calldata _data, address _fallback, uint256 _toChainID) external;
}

contract POC is Ownable {
    AnyswapRouter private bridge;
    AnyswapCallProxy private callProxy;

    /// @param _anyswapRouterAddress Address of the default bridge
    constructor(address _anyswapRouterAddress, address _anyswapCallProxyAddress) {
        bridge = AnyswapRouter(_anyswapRouterAddress);
        callProxy = AnyswapCallProxy(_anyswapCallProxyAddress);
    }

    event CrossTokensSent();
    event CrossFunctionSent();
    event CrossFunctionExecuted(uint256 availableAmount);
    event CrossFunctionFailed();

    function initTokensCross(uint256 _srcAmount) external {
        // USDC on BSC
        address _srcToken = 0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d;
        // To Polygon mainnet
        uint256 _toChainId = 137;

        // Take ownership of tokens from user
        TransferHelper.safeTransferFrom(_srcToken, msg.sender, address(this), _srcAmount);

        // Approve the bridge to take the tokens
        TransferHelper.safeApprove(_srcToken, address(bridge), _srcAmount);

        // Call bridge to cross-chain
        // We tell the bridge to move the tokens to our address on the other side
        bridge.anySwapOutUnderlying(_srcToken, address(this), _srcAmount, _toChainId);

        // Fire event of token crossing function called
        emit CrossTokensSent();

        // Compute the calldata to be executed on the destination chain
        bytes memory data = abi.encodeWithSignature("finalizeCross()");

        // Compute the fallback calldata
        bytes memory fallbackData = abi.encodeWithSignature("somethingWentWrong()");

        // Now we either call to `anyCall` to execute a cross-chain function
        callProxy.anyCall(address(this), data, fallbackData, _toChainId);

        // Fire event of cross-function execution called
        emit CrossFunctionSent();
    }

    function finalizeCross() external {
        // USDC on Polygon mainnet
        address _dstToken = 0x2791bca1f2de4661ed88a30c99a7a9449aa84174;

        // Check the available amount of tokens
        uint256 availableAmount = IERC20(_dstToken).balanceOf(address(this));

        // Fire event to track
        emit CrossFunctionExecuted(availableAmount);
    }

    /// @dev Just for completeness
    function somethingWentWrong() external {
        emit CrossFunctionFailed();
    }

    /// @dev Sends all tokens deposited on this contract to the caller
    function recoverTokens(address token) external onlyOwner {
        uint256 availableAmount = IERC20(token).balanceOf(address(this));
        TransferHelper.safeTransfer(token, msg.sender, availableAmount);
    }
}
