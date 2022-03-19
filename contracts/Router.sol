//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "./dexs/IDEX.sol";
import "./dexs/UniswapDEX.sol";

interface AnyswapRouter {
    function anySwapOutUnderlying(address token, address to, uint amount, uint toChainID) external;
}

contract Router {
    AnyswapRouter private bridge;
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
        bridge = AnyswapRouter(_anyswapRouterAddress);
    }

    /// Initialize the mapping of DEX's that router has available in its network
    /// @dev codes and addresses need to be same length, otherwise we fail
    /// @param _dexAddresses Array of DEX addresses
    /// @param _dexCodes Array of DEX identifiers
    function initializeDEXs(address[] memory _dexAddresses, dexCode[] memory _dexCodes) private {
        require(_dexAddresses.length == _dexCodes.length, "Addresses count cannot mismatch codes count.");
        require(_dexAddresses.length != 0, "No swap providers informed.");
        for (uint8 i = 0; i < _dexAddresses.length; i++) {
            IDEX provider = constructDEX(_dexAddresses[i], _dexCodes[i]);
            swapProviders[uint8(_dexCodes[i])] = provider;
        }
    }

    /// Construct and return the concrete DEX object given its code and address
    /// @dev It returns an IDEX object so the router doesn't need to know the specifics
    /// @param _dexAddress The address of the DEX to be initialized
    /// @param _dexCode The code of the DEX we are initializing
    function constructDEX(address _dexAddress, dexCode _dexCode) private returns (IDEX){
        if (_dexCode == dexCode.Uniswap) {
            return new UniswapDEX(_dexAddress);
        }
        else {
            revert("Given `dexCode` implementation was not found.");
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
        // Take ownership of tokens from user
        TransferHelper.safeTransferFrom(_srcToken, msg.sender, address(this), _srcAmount);

        // Swap `srcToken` for a `dstCrossToken` that can go through the bridge into a native token
        IDEX swapProvider = swapProviders[_srcDEX];
        TransferHelper.safeApprove(_srcToken, swapProvider.custodianAddress(), _srcAmount);
        uint256 crossAmount = swapProvider.swap(_srcToken, _srcCrossToken, address(this), _srcAmount);

        // Approve the bridge to take the tokens
        TransferHelper.safeApprove(_srcCrossToken, address(bridge), crossAmount);

        // Call bridge to cross-chain
        // We tell the bridge to move the tokens to our address on the other side
        bridge.anySwapOutUnderlying(_srcCrossToken, address(this), crossAmount, _toChainId);

        // Compute the calldata to be executed on the destination chain
        bytes memory data = abi.encodeWithSignature(
            "finalizeTokenCross(address, address, address, uint256, uint256, unit8, unit8)",
            _dstCrossToken,
            _dstToken,
            msg.sender,
            crossAmount,
            _toChainId,
            _dstDEX,
            _bridge
        );

        // Now we either call to `anyCall` to execute a cross-chain function
        // or emit an event so a relayer can execute the swap on the other side when funds are ready
        // ...
    }

    /// Finalize the process of swidging
    /// @dev This function is executed on the destination chain
    function finalizeTokenCross(address _dstCrossToken, address _dstToken, address _to, uint256 _crossAmount, uint256 _toChainId, uint8 _dstDEX) external {
        require(_toChainId == block.chainid, "Wrong destination call");

        // Swap the received `dstCrossToken` into the `dstToken` desired by the user
        IDEX swapProvider = swapProviders[_dstDEX];
        TransferHelper.safeApprove(_dstCrossToken, swapProvider.custodianAddress(), _crossAmount);
        uint256 finalAmount = swapProvider.swap(_dstCrossToken, _dstToken, address(this), _crossAmount);

        // Transfer `dstToken` to the user
        TransferHelper.safeTransfer(_dstToken, _to, finalAmount);
    }

}
