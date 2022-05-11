from brownie.network.main import show_active

from scripts.src.deploy import from_deployer, from_user
from scripts.src.accounts import user, random
from scripts.src.tokens import load_tokens, transfer_tokens_to

"""
Executes the function finalizeTokenCross from Router
"""
def main():
    network = show_active()

    contracts.router().updateRelayer(user.address, from_deployer)

    tokens = load_tokens(network)

    amount = 1.3 * 1000000000000000000

    callData = ''

    tx = contracts.router().finalizeSwidge(
        amount,
        random.address,
        [
            0,
            tokens['usdc']['address'],
            tokens['link']['address'],
            callData,
            True
        ],
        'random-uuid',
        from_user)

    print(tx.info())
    print('---')
    print(tx.call_trace())