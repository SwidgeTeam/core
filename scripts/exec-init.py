from brownie.network.main import show_active

from scripts.src.deploy import deploy_contracts, from_deployer, from_user
from scripts.src.accounts import user
from scripts.src.addresses import load_addresses
from scripts.src.tokens import load_tokens, transfer_tokens_to, approve_tokens_to

"""
Executes the function initTokenCross from Router
"""
def main():
    network = show_active()
    address = load_addresses(network)
    tokens = load_tokens(network)

    amount = 1.3 * 1000000000000000000
    swapperCallData = ''
    destinationChainId = '250'
    bridgeCallData = '0x000000000000000000000000d69b31c3225728cc57ddaf9be532a4ee1620be51'

    # Approve the contract to take the tokens
    approve_tokens_to(
        token_address=tokens['link']['address'],
        from_address=user.address,
        to_address=contracts.router().address,
        amount=amount)

    tx = contracts.router().initSwidge(
        amount,
        [
            0,
            tokens['link']['address'],
            tokens['usdc']['address'],
            swapperCallData,
            True
        ],
        [
            tokens['usdc']['address'],
            destinationChainId,
            bridgeCallData,
            True
        ],
        'random-uuid',
        from_user)

    print(tx.info())
