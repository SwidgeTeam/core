from brownie import Router, ZeroEx, accounts, Contract

from scripts.src.deploy import from_deployer
from scripts.src.addresses import save_addresses, load_addresses

def main():
    network = 'hardhat'

    address = load_addresses(network)

    router = Router.at(address['router'])

    router.updateSwapProvider(
        address['swapImpl']['zeroex']['code'],
        address['swapImpl']['zeroex']['address'],
        from_deployer)

    router.updateBridgeProvider(
        address['bridgeImpl']['anyswap']['code'],
        address['bridgeImpl']['anyswap']['address'],
        from_deployer)
