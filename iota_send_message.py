# Import neccessary modules
# Using pyota library
from iota import Iota, TryteString, Address, Tag, ProposedTransaction
from pprint import pprint

# Declare an API object
# Connect to legacy devnet
api = Iota('https://nodes.devnet.iota.org:443')
# https://nodes.iota.org legacy hornet

# Request information about the node
#response = api.get_node_info()

# Using pprint instead of print for a nicer looking result in the console
#pprint(response)

# Prepare custom data
my_data = TryteString.from_unicode('Data written on devnet!')

# Generate a random address that doesn't have to belong to anyone (81 or 90)
my_address = Address.random(81)

# Tag is optional here
my_tag = Tag(b'MY9FIRST9TAG')

# Prepare a transaction object
tx = ProposedTransaction(
    address=my_address,
    value=0,
    tag=my_tag,
    message=my_data
)

# Send the transaction to the network
response = api.send_transfer([tx], min_weight_magnitude=9)

pprint('Check your transaction on the Tangle!')
pprint('https://explorer.iota.org/legacy-devnet/transaction/%s' % response['bundle'][0].hash)

# For e.g. go to https://explorer.iota.org/legacy-devnet/transaction/TXBQO9M9KCYHZPJCTHJRWNESBXJGPCBDZJPLURJYTTGJLQRHQSHTIVHNWOTINYB9HMFEPVMVMOZVTZ999 and check message