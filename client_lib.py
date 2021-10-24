import iota_client
import os
# Installation: https://client-lib.docs.iota.org/docs/libraries/python/getting_started/
# https://client-lib.docs.iota.org/docs/libraries/python/api_reference

NODE_URL = SEED = os.getenv('HORNET_NODE_ADDRESS')
client = iota_client.Client(
    nodes_name_password=[[NODE_URL]], node_sync_disabled=True)

print(client.get_info())

print(f'message() Indexation')
message_id_indexation = client.message(
    index="Hello", data=[84, 97, 110, 103, 108, 101])
print(f'Indexation sent with message_id: {message_id_indexation}')
print(
    f'Please check http://127.0.0.1:14265/api/v1/messages/{message_id_indexation}')

#Please check http://127.0.0.1:14265/api/v1/messages/{'message_id': '13e32ce342503c9ff338f6ff7f85f2c68056fc0571b76be6fae69e2e2d3e0e2e', 
# 'network_id': ..., 'parents': ['2514a5b181d37ad2c3ea5ec6d93f17077edbae0f7fde9a5457b69c821458b146', 
# '2563f8cce1f5abcea7f7ed97c8c563eabecd53b99d96fa6e16756e7f65e4c403', '9a2edbd00811d87e34d41032cb429020d4bca13a284675e83f08295a9977e9a1', 
# 'f0c689332a350cbdbdc9ea66702ec3694bb7224c6a2d13d60f7892ab150def59'], 'payload': {'transaction': None, 'milestone': None, 'indexation': 
# [{'index': '48656c6c6f', 'data': [84, 97, 110, 103, 108, 101]}], 'receipt': None, 'treasury_transaction': None}, 'nonce': 9223372036855014641}
# https://explorer.iota.org/mainnet/message/13e32ce342503c9ff338f6ff7f85f2c68056fc0571b76be6fae69e2e2d3e0e2e