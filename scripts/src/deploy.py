from brownie import Router, ZeroEx, Anyswap, accounts, Contract

from scripts.src.accounts import deployer, user, random
from scripts.src.addresses import save_addresses, load_addresses
from scripts.src.Contracts import Contracts

from_deployer = {'from': deployer}
from_user = {'from': user}

def deploy_contracts(network):
    address = load_addresses(network)

    router = deployer.deploy(Router)
    zeroEx = deployer.deploy(ZeroEx)
    anyswap = deployer.deploy(Anyswap, address['bridges']['anyswap'])

    zeroEx.updateRouter(router, from_deployer)
    anyswap.updateRouter(router, from_deployer)

    router.updateSwapProvider(
        address['swapImpl']['zeroex']['code'],
        zeroEx,
        from_deployer)

    router.updateBridgeProvider(
        address['bridgeImpl']['anyswap']['code'],
        anyswap,
        from_deployer)

    address['router'] = router.address
    address['bridgeImpl']['anyswap']['address'] = anyswap.address
    address['swapImpl']['zeroex']['address'] = zeroEx.address

    router.updateRelayer(address['router'], from_deployer)

    return Contracts(
        router=router,
        zeroex=zeroEx,
        multichain=anyswap)
