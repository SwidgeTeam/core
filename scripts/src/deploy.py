from brownie import Router, ZeroEx, Anyswap, accounts, Contract

from scripts.src.accounts import deployer, user, random
from scripts.src.addresses import load_addresses
from scripts.src.Contracts import Contracts

from_deployer = {'from': deployer}
from_user = {'from': user}

"""
Deploys the whole set of contracts
and returns the instances
"""
def deploy_contracts(network):
    address = load_addresses(network)

    router = deployer.deploy(Router)
    zeroEx = deployer.deploy(ZeroEx)
    anyswap = deployer.deploy(Anyswap, address['bridges']['anyswap'])

    zeroEx.updateRouter(router.address, from_deployer)
    anyswap.updateRouter(router.address, from_deployer)

    router.updateSwapProvider(
        address['swapImpl']['zeroex']['code'],
        zeroEx.address,
        from_deployer)

    router.updateBridgeProvider(
        address['bridgeImpl']['anyswap']['code'],
        anyswap.address,
        from_deployer)

    router.updateRelayer(router.address, from_deployer)

    return Contracts(
        router=router,
        zeroex=zeroEx,
        multichain=anyswap)
