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

    /// Init the process of swidging
    /// @dev This function is executed on the origin chain
    /// @param _srcToken Address of the token the user wants to swidge
    /// @param _srcCrossToken Address of the token we will swap on origin chain to send to the bridge
    /// @param _dstCrossToken Address of the token that will arrive to the destination chain
    /// @param _dstToken Address of the token the user wants to receive on destination
    /// @param _srcAmount Amount of source tokens that user wants to move
    /// @param _toChainId Chain identifier that the user wants its token to receive
    /// @param _srcDEX Identifier of the exchange to use on the origin chain
    /// @param _dstDEX Identifier of the exchange to use on the destination chain
    function initTokensCross(
        address _srcToken,
        address _srcCrossToken,
        address _dstCrossToken,
        address _dstToken,
        uint256 _srcAmount,
        uint256 _toChainId,
        uint8 _bridge,
        uint8 _srcDEX,
        uint8 _dstDEX
    ) external {
        // Take ownership of user's tokens
        TransferHelper.safeTransferFrom(_srcToken, msg.sender, address(this), _srcAmount);

        IBridge bridge = bridgeProviders[_bridge];

        // Approve tokens for the bridge to take
        TransferHelper.safeApprove(_srcToken, address(bridge), _srcAmount);

        // Execute bridge process
        bridge.send(_srcCrossToken, _srcToken, msg.sender, _srcAmount, _toChainId);
    }

    /// Finalize the process of swidging
    function finalizeTokenCross(address _dstCrossToken, address _dstToken, address _to, uint256 _crossAmount, uint256 _toChainId, uint8 _dstDEX) external {

    }

    /// To retrieve any tokens that got stuck on the contract
    function retrieve(address _token, uint256 _amount) external {
        TransferHelper.safeTransfer(_token, msg.sender, _amount);
    }
}
