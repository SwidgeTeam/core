from brownie import Router, ZeroEx, accounts, Contract
from scripts.src.deploy import deploy_contracts, from_deployer, from_user
from scripts.src.accounts import deployer, user, random
from scripts.src.tokens import load_tokens, transfer_tokens_to

"""
Executes the function finalizeTokenCross from Router
"""
def main():
    network = 'hardhat'
    contracts = deploy_contracts(network)

    contracts.router().updateRelayer(user.address, from_deployer)

    tokens = load_tokens(network)

    transfer_tokens_to(
        token_address=tokens['usdc']['address'],
        holder_address=tokens['usdc']['holder'],
        to_address=user.address,
        amount=100000000)

    tx = contracts.router().finalizeTokenCross(
        1000000,
        random.address,
        [
            0,
            tokens['usdc']['address'],
            tokens['usdc']['address'],
            '0x',
            True
        ],
        'random-uuid',
        from_user)

    print(tx)