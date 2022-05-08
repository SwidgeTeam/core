from brownie import ZeroEx, Anyswap

from scripts.src.deploy import from_deployer
from scripts.src.addresses import load_addresses

"""
Updates the Router address on all deployed providers
"""
def main():
    network = 'hardhat'
    address = load_addresses(network)

    zeroEx = ZeroEx.at(address['swapImpl']['zeroex']['address'])
    multichain = Anyswap.at(address['bridgeImpl']['anyswap']['address'])

    zeroEx.updateRouter(address['router'], from_deployer)
    multichain.updateRouter(address['router'], from_deployer)
