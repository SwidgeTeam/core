import yaml

"""
Loads addresses of a specific domain
into into an array
"""
def load_addresses(network):
    main_network = network.replace('-fork', '')
    with open('contracts.yaml', 'r') as file:
        addresses = yaml.safe_load(file)
        return addresses[main_network]

"""
Store the addresses of a specific domain
into the file
"""
def save_addresses(network, arr):
    if '-fork' in network:
        network = 'local'

    with open('contracts.yaml', 'r') as file:
        addresses = yaml.safe_load(file)

    addresses[network] = arr

    with open('contracts.yaml', 'w') as file:
        yaml.dump(addresses, file)
