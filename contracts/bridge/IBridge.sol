//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

abstract contract IBridge is Ownable {
    address private router;

    modifier onlyRouter() {
        require(msg.sender == router, "Unauthorized caller");
        _;
    }

    event UpdatedRouter(address indexed routerAddress);

    function updateRouter(address routerAddress) external onlyOwner {
        router = routerAddress;
        emit UpdatedRouter(routerAddress);
    }

    function retrieve(address _token, uint256 _amount) external onlyOwner {
        TransferHelper.safeTransfer(_token, msg.sender, _amount);
    }

    function send(
        address _token,
        address _router,
        uint256 _amount,
        uint256 _toChainId,
        bytes calldata _data
    ) external virtual;
}
