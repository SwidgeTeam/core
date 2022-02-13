//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./token/IERC20.sol";
import "./libraries/TransferHelper.sol";
import "./dexs/IDEX.sol";
import "./dexs/UniswapDEX.sol";

interface AnyswapRouter {
    function anySwapOut(address token, address to, uint amount, uint toChainID) external;
}

contract RouterForwarder {
    using SafeERC20 for IERC20;
    address private anyswapAddress;
    mapping(uint8 => IDEX) private swapProviders;

    enum dexCode {
        Uniswap, // 0
        Sushiswap // 1
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
        anyswapAddress = _anyswapRouterAddress;
    }

    /// Initialize the mapping of DEX's that router has available in its network
    /// @dev codes and addresses need to be same length, otherwise we fail
    /// @param _dexAddresses Array of DEX addresses
    /// @param _dexCodes Array of DEX identifiers
    function initializeDEXs(address[] memory _dexAddresses, dexCode[] memory _dexCodes) internal {
        require(_dexAddresses.length == _dexCodes.length, "INIT: Addresses count mismatch codes count.");
        require(_dexAddresses.length != 0, "INIT: No swap providers informed.");
        for (uint8 i = 0; i < _dexAddresses.length; i++) {
            IDEX provider = constructDEX(_dexAddresses[i], _dexCodes[i]);
            swapProviders[uint8(_dexCodes[i])] = provider;
        }
    }

    /// Construct and return the concrete DEX object given its code and address
    /// @dev It returns an IDEX object so the router doesn't need to know the specifics
    /// @param _dexAddress The address of the DEX to be initialized
    /// @param _dexCode The code of the DEX we are initializing
    function constructDEX(address _dexAddress, dexCode _dexCode) internal returns (IDEX){
        if (_dexCode == dexCode.Uniswap) {
            return new UniswapDEX(_dexAddress);
        }
        else {
            // Just for safety, but code won't reach here
            // since Solidity performs value-checking on enums parameters
            revert("INIT: Given `dexCode` was not found.");
        }
    }

    /// Init the process of swidging
    /// @dev This function is executed on the origin chain
    /// @param _srcToken Address of the source token the user wants to swidge
    /// @param _dstToken Address of the destination token the user wants to receive on destination
    /// @param _to Address of the user on the destination chain
    /// @param _amount Amount of source tokens that user wants to move
    /// @param _toChainId Chain identifier that the user wants its token to receive
    function initTokensCross(address _srcToken, address _dstToken, address _to, uint256 _amount, uint256 _toChainId) external {
        // Take ownership of tokens from user
        TransferHelper.safeTransferFrom(_srcToken, msg.sender, address(this), _amount);

        // Swap `srcToken` for a HL `crossToken` that can go through the bridge into a native token
        // - The importance of using a HL token as a crossing one is that we want the bridge
        // - to send us native tokens that we can immediately swap in a DEX for anything else
        address crossToken = address(0); // USDC? Configurable from front?
        uint256 crossAmount = 0; // Returned by swapProvider when swap is done
        // ...

        // Approve the bridge to take the tokens
        TransferHelper.safeApprove(crossToken, anyswapAddress, crossAmount);

        // Call bridge to cross-chain
        // We tell the bridge to move the tokens to our address on the other side
        AnyswapRouter(anyswapAddress).anySwapOut(crossToken, address(this), crossAmount, _toChainId);

        // Compute the calldata to be executed on the destination chain
        bytes memory data = abi.encodeWithSignature(
            "finalizeTokenCross(address, address, address, uint256, uint256)",
            crossToken,
            _dstToken,
            _to,
            crossAmount,
            _toChainId
        );

        // Now we either call to `anyCall` to execute a cross-chain function
        // or emit an event so a relayer can execute the swap on the other side when funds are ready
        // ...
    }

    /// Finalize the process of swidging
    /// @dev This function is executed on the destination chain
    /// @dev ¿Should only be executed by bridge or relayer?
    function finalizeTokenCross(address _crossToken, address _dstToken, address _to, uint256 _crossAmount, uint256 _toChainId) external {
        require(_toChainId == block.chainid, "CROSS: Wrong destination call");

        // Take ownership of token from bridge/proxy
        TransferHelper.safeTransferFrom(_crossToken, msg.sender, address(this), _crossAmount);

        // Swap the received HL `crossToken` into the `dstToken` desired by the user
        // If we want the user to decide which DEX is going to be used we will need to receive it through params
        uint256 finalAmount = 0; // Returned by swapProvider when swap is done

        // Transfer `dstToken` to the user
        TransferHelper.safeTransfer(_dstToken, _to, finalAmount);
    }

}
