from brownie import Contract
import yaml

"""
Loads the list of tokens data of a specific domain
"""
def load_tokens(network):
    with open('tokens.yaml', 'r') as file:
        addresses = yaml.safe_load(file)
        return addresses[network]

"""
Transfers an `amount` of tokens from `holder_address` to `to_address`
"""
def transfer_tokens_to(token_address, holder_address, to_address, amount):
    token = Contract(token_address)
    token.transfer(to_address, amount, {'from': holder_address})
