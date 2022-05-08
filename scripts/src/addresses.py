import yaml

"""
Loads addresses of a specific domain
into into an array
"""
def load_addresses(network):
    with open('contracts.yaml', 'r') as file:
        addresses = yaml.safe_load(file)
        return addresses[network]

"""
Store the addresses of a specific domain
into the file
"""
def save_addresses(network, arr):
    with open('contracts.yaml', 'r') as file:
        addresses = yaml.safe_load(file)
    addresses[network] = arr
    with open('contracts.yaml', 'w') as file:
        yaml.dump(addresses, file)
