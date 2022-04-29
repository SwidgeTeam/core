//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "./dexs/IDEX.sol";
import "./bridge/IBridge.sol";

contract Router is Ownable {
    address private relayerAddress;
    mapping(uint8 => IBridge) private bridgeProviders;

    enum bridgeCode {
        Anyswap // 0
    }

    /// @param _anyswapRouterAddress Address of the default bridge
    constructor(address _anyswapRouterAddress) {
        bridgeProviders[uint8(bridgeCode.Anyswap)] = IBridge(_anyswapRouterAddress);
    }

    /**
     * @dev Updates the address of the authorized relayer
     */
    function updateRelayer(address _relayerAddress) external onlyOwner {
        address oldAddress = relayerAddress;
        relayerAddress = _relayerAddress;
        emit UpdatedRelayer(oldAddress, relayerAddress);
    }

    /**
     * @dev Throws if called by any account other than the relayer.
     */
    modifier onlyRelayer() {
        require(relayerAddress == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Emitted when the relayer address is updated
     */
    event UpdatedRelayer(
        address oldAddress,
        address newAddress
    );

    /**
     * @dev Emitted when a multi-chain swap is initiated
     */
    event CrossInitiated(
        bytes txUuid,
        uint256 amountOut
    );

    /**
     * @dev Emitted when a multi-chain swap is finalized
     */
    event CrossFinalized(
        bytes txUuid,
        uint256 amountOut
    );

    /**
     * @dev Emitted when a single-chain swap is completed
     */
    event SwapExecuted(
        bytes txUuid,
        uint256 amountOut
    );

    /**
     * @dev Defines the details for the swap step
     */
    struct SwapData {
        address tokenIn;
        address tokenOut;
        address payable callAddress;
        bytes callData;
        bool required;
    }

    /**
     * @dev Defines the details for the bridge step
     */
    struct BridgeData {
        address tokenIn;
        uint256 toChainId;
        bytes data;
        bool required;
    }

    /// Init the process of swidging
    /// @dev This function is executed on the origin chain
    function initTokensCross(
        uint256 _srcAmount,
        SwapData calldata _swapData,
        BridgeData calldata _bridgeData,
        bytes calldata _txUuid
    ) external payable {
        // We need either the swap or the bridge step to be required
        require(_swapData.required || _bridgeData.required, "No required actions");

        address tokenToTakeIn;
        // Need to check which token is going to be taken as input
        if (_swapData.required) {
            tokenToTakeIn = _swapData.tokenIn;
        }
        else {
            tokenToTakeIn = _bridgeData.tokenIn;
        }

        // Take ownership of user's tokens
        TransferHelper.safeTransferFrom(
            tokenToTakeIn,
            msg.sender,
            address(this),
            _srcAmount
        );

        uint256 finalAmount;
        // Store the amount for the next step
        // depending on the step to take
        if (_swapData.required) {
            // Approve to ZeroEx
            TransferHelper.safeApprove(
                _swapData.tokenIn,
                _swapData.callAddress,
                _srcAmount
            );

            // Execute swap with ZeroEx and compute final `boughtAmount`
            finalAmount = IERC20(_swapData.tokenOut).balanceOf(address(this));
            (bool success,) = _swapData.callAddress.call{value : msg.value}(_swapData.callData);
            require(success, "SWAP FAILED");
            finalAmount = IERC20(_swapData.tokenOut).balanceOf(address(this)) - finalAmount;
        }
        else {
            finalAmount = _srcAmount;
        }

        if (_bridgeData.required) {
            // Load selected bridge provider
            IBridge bridge = bridgeProviders[uint8(bridgeCode.Anyswap)];

            // Approve tokens for the bridge to take
            TransferHelper.safeApprove(
                _bridgeData.tokenIn,
                address(bridge),
                finalAmount
            );

            // Execute bridge process
            bridge.send(
                _bridgeData.tokenIn,
                address(this),
                finalAmount,
                _bridgeData.toChainId,
                _bridgeData.data
            );

            // Emit event for relayer
            emit CrossInitiated(_txUuid, finalAmount);
        }
        else {
            // Bridging is not required, means we are not changing network
            // so we send the assets back to the user
            TransferHelper.safeTransfer(_swapData.tokenOut, msg.sender, finalAmount);
            emit SwapExecuted(_txUuid, finalAmount);
        }
    }

    /// Finalize the process of swidging
    function finalizeTokenCross(
        uint256 _amount,
        address _receiver,
        SwapData calldata _swapData,
        bytes calldata _txUuid
    ) external payable onlyRelayer {
        // Approve to ZeroEx
        TransferHelper.safeApprove(
            _swapData.tokenIn,
            _swapData.callAddress,
            _amount
        );

        // Execute swap with ZeroEx and compute final `boughtAmount`
        uint256 boughtAmount = IERC20(_swapData.tokenOut).balanceOf(address(this));
        (bool success,) = _swapData.callAddress.call{value : msg.value}(_swapData.callData);
        require(success, "SWAP FAILED");
        boughtAmount = IERC20(_swapData.tokenOut).balanceOf(address(this)) - boughtAmount;

        // Send tokens to the user
        TransferHelper.safeTransfer(
            _swapData.tokenOut,
            _receiver,
            boughtAmount
        );

        emit CrossFinalized(_txUuid, boughtAmount);
    }

    /// To retrieve any tokens that got stuck on the contract
    function retrieve(address _token, uint256 _amount) external onlyOwner {
        TransferHelper.safeTransfer(_token, msg.sender, _amount);
    }
}
