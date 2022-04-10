//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "./dexs/IDEX.sol";
import "./bridge/IBridge.sol";

contract Router {
    mapping(uint8 => IBridge) private bridgeProviders;

    enum bridgeCode {
        Anyswap // 0
    }

    /// @param _anyswapRouterAddress Address of the default bridge
    constructor(address _anyswapRouterAddress) {
        bridgeProviders[uint8(bridgeCode.Anyswap)] = IBridge(_anyswapRouterAddress);
    }

    struct SwapData {
        address tokenIn;
        address tokenOut;
        address payable callAddress;
        bytes callData;
    }

    struct BridgeData {
        address tokenIn;
        address receiverAddress;
        uint256 toChainId;
        bytes data;
    }

    event CrossInitiated(
        uint256 amount,
        uint256 indexed toChainId,
        address indexed router,
        address dstTokenIn,
        address dstTokenOut,
        address maker,
        bytes data
    );

    /// Init the process of swidging
    /// @dev This function is executed on the origin chain
    function initTokensCross(
        uint256 _srcAmount,
        SwapData calldata _srcSwapData,
        SwapData calldata _dstSwapData,
        BridgeData calldata _bridgeData
    ) external payable {
        // Take ownership of user's tokens
        TransferHelper.safeTransferFrom(
            _srcSwapData.tokenIn,
            msg.sender,
            address(this),
            _srcAmount
        );

        // Approve to ZeroEx
        TransferHelper.safeApprove(
            _srcSwapData.tokenIn,
            _srcSwapData.callAddress,
            _srcAmount
        );

        // Execute swap with ZeroEx and compute final `boughtAmount`
        uint256 boughtAmount = IERC20(_srcSwapData.tokenOut).balanceOf(address(this));
        (bool success,) = _srcSwapData.callAddress.call{value : msg.value}(_srcSwapData.callData);
        require(success, "SWAP FAILED");
        boughtAmount = IERC20(_srcSwapData.tokenOut).balanceOf(address(this)) - boughtAmount;

        // Load selected bridge provider
        IBridge bridge = bridgeProviders[uint8(bridgeCode.Anyswap)];

        // Approve tokens for the bridge to take
        TransferHelper.safeApprove(
            _bridgeData.tokenIn,
            address(bridge),
            boughtAmount
        );

        // Execute bridge process
        bridge.send(
            _bridgeData.tokenIn,
            address(this),
            _bridgeData.receiverAddress,
            boughtAmount,
            _bridgeData.toChainId,
            _bridgeData.data
        );

        // Refund any unspent protocol fees to the sender.
        payable(msg.sender).transfer(address(this).balance);

        // Emit event for relayer
        emit CrossInitiated(
            boughtAmount,
            _bridgeData.toChainId,
            _bridgeData.receiverAddress,
            _dstSwapData.tokenIn,
            _dstSwapData.tokenOut,
            _dstSwapData.callAddress,
            _dstSwapData.callData
        );
    }

    /// Finalize the process of swidging
    function finalizeTokenCross(address _dstCrossToken, address _dstToken, address _to, uint256 _crossAmount, uint256 _toChainId, uint8 _dstDEX) external {

    }

    /// To retrieve any tokens that got stuck on the contract
    function retrieve(address _token, uint256 _amount) external {
        TransferHelper.safeTransfer(_token, msg.sender, _amount);
    }
}
