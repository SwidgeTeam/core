from brownie import accounts, config

"""
Names the accounts with names for the rest of the scripts to use
"""
mnemonic = config['wallet']['mnemonic']
acc = accounts.from_mnemonic(mnemonic, 10)

old_deployer = acc[0]
admin = acc[1]
user = acc[2]
deployer = acc[3]
random = acc[4]