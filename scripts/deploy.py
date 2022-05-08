from brownie import Router, ZeroEx, Anyswap, accounts, config
from brownie.network.main import show_active

from scripts.src.accounts import deployer, user, random
from scripts.src.addresses import save_addresses, load_addresses
from scripts.src.deploy import from_deployer

"""
Deploy something
"""
def main(contract):
    network = show_active()
    address = load_addresses(network)

    if contract == 'zeroex':
        # Deploy provider contract
        zeroEx = deployer.deploy(ZeroEx)
        # Update router address on provider
        zeroEx.updateRouter(address['router'], from_deployer)
        # Store new address
        address['swapImpl']['zeroex']['address'] = zeroEx.address

    elif contract == 'multichain':
        # Deploy provider contract
        multichain = deployer.deploy(Anyswap, address['bridges']['anyswap'])
        # Update router address on provider
        multichain.updateRouter(address['router'], from_deployer)
        # Store new address
        address['bridgeImpl']['anyswap']['address'] = multichain.address

    elif contract == 'router':
        # Deploy router contract
        router = deployer.deploy(Router)
        # Store new address
        address['router'] = router.address

    save_addresses(network, address)