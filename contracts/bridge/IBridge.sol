//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

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

    function send(
        address _token,
        address _to,
        uint256 _amount,
        uint256 _toChainId,
        bytes calldata _data
    ) external virtual;
}
