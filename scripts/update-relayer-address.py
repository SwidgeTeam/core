from brownie import Router

from scripts.src.deploy import from_deployer
from scripts.src.addresses import load_addresses

"""
Sets the relayer address into the Router
"""
def main():
    network = 'hardhat'

    address = load_addresses(network)

    router = Router.at(address['router'])

    router.updateRelayer(
        address['relayer'],
        from_deployer)
