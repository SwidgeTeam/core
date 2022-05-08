from brownie import Contract
import yaml

def load_tokens(network):
    with open('tokens.yaml', 'r') as file:
        addresses = yaml.safe_load(file)
        return addresses[network]

def transfer_tokens_to(token_address, holder_address, to_address, amount):
    token = Contract(token_address)
    token.transfer(to_address, amount, {'from': holder_address})
