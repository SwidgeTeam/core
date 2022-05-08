import yaml

def load_addresses(network):
    with open('contracts.yaml', 'r') as file:
        addresses = yaml.safe_load(file)
        return addresses[network]

def save_addresses(network, arr):
    with open('contracts.yaml', 'r') as file:
        addresses = yaml.safe_load(file)
    addresses[network] = arr
    with open('contracts.yaml', 'w') as file:
        yaml.dump(addresses, file)
