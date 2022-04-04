//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "./dexs/IDEX.sol";
import "./bridge/IBridge.sol";

contract Router {
    mapping(uint8 => IDEX) private swapProviders;
    mapping(uint8 => IBridge) private bridgeProviders;

    enum dexCode {
        Uniswap, // 0
        Sushiswap // 1
        // ...
    }

    enum bridgeCode {
        Anyswap // 0
        // ...
    }

    /// @param _anyswapRouterAddress Address of the default bridge
    /// @param _dexAddresses Array of DEX addresses
    /// @param _dexCodes Array of DEX identifiers
    constructor(address _anyswapRouterAddress, address[] memory _dexAddresses, dexCode[] memory _dexCodes) {
        initializeBridge(_anyswapRouterAddress);
        initializeDEXs(_dexAddresses, _dexCodes);
    }

    /// Initialize bridge address
    /// @dev _anyswapRouterAddress Address of AnyswapRouter contract
    function initializeBridge(address _anyswapRouterAddress) internal {
        bridgeProviders[uint8(bridgeCode.Anyswap)] = IBridge(_anyswapRouterAddress);
    }

    /// Initialize the mapping of DEX's that router has available in its network
    /// @dev codes and addresses need to be same length, otherwise we fail
    /// @param _dexAddresses Array of DEX addresses
    /// @param _dexCodes Array of DEX identifiers
    function initializeDEXs(address[] memory _dexAddresses, dexCode[] memory _dexCodes) private {
        require(_dexAddresses.length == _dexCodes.length, "Addresses count cannot mismatch codes count.");
        require(_dexAddresses.length != 0, "No swap providers informed.");
        for (uint8 i = 0; i < _dexAddresses.length; i++) {
            IDEX provider = IDEX(_dexAddresses[i]);
            swapProviders[uint8(_dexCodes[i])] = provider;
        }
    }

    struct BridgeData {
        uint8 id;
        uint256 toChainId;
        bytes data;
    }

    struct ExchangeData {
        uint8 id;
        bytes data;
    }

    /// Init the process of swidging
    /// @dev This function is executed on the origin chain
    /// @param _srcToken Address of the token the user wants to swidge
    /// @param _srcAmount Amount of source tokens that user wants to move
    function initTokensCross(
        address _srcToken,
        address _dstToken,
        uint256 _srcAmount,
        ExchangeData calldata _srcDEXData,
        ExchangeData calldata _dstDEXData,
        BridgeData calldata _bridgeData
    ) external payable {
        // Take ownership of user's tokens
        TransferHelper.safeTransferFrom(_srcToken, msg.sender, address(this), _srcAmount);

        // Get initial balance to compute final bought amount
        uint256 boughtAmount = IERC20(_dstToken).balanceOf(address(this));

        // Approve to ZeroEx
        TransferHelper.safeApprove(_srcToken, _zeroExApproval, _srcAmount);

        // Execute ZeroEx
        (bool success,) = _zeroExMaker.call{value : msg.value}(_data);
        require(success, "SWAP FAILED");

        // Refund any unspent protocol fees to the sender.
        msg.sender.transfer(address(this).balance);

        // Compute final amount of bought tokens
        boughtAmount = IERC20(_dstToken).balanceOf(address(this)) - boughtAmount;

        // Transfer to the user
        TransferHelper.safeTransfer(_dstToken, msg.sender, boughtAmount);

        // Load selected bridge provider
        IBridge bridge = bridgeProviders[_bridgeData.id];

        // Approve tokens for the bridge to take
        TransferHelper.safeApprove(_srcCrossToken, address(bridge), amountOut);

        // Execute bridge process
        bridge.send(_srcToken, address(this), amountOut, _bridgeData.toChainId, _bridgeData.data);
    }

    /// Finalize the process of swidging
    function finalizeTokenCross(address _dstCrossToken, address _dstToken, address _to, uint256 _crossAmount, uint256 _toChainId, uint8 _dstDEX) external {

    }

    /// To retrieve any tokens that got stuck on the contract
    function retrieve(address _token, uint256 _amount) external {
        TransferHelper.safeTransfer(_token, msg.sender, _amount);
    }
}
