from brownie import Router, ZeroEx, Anyswap, accounts, Contract

from scripts.src.addresses import save_addresses, load_addresses
from scripts.src.deploy import deploy_contracts

def main():
    network = 'hardhat'
    contracts = deploy_contracts(network)

    address = load_addresses(network)

    address['router'] = contracts.router().address

    save_addresses(network, address)

