# receive_msg.py
#
# SPDX-FileCopyrightText: Copyright 2021 Fabbio Protopapa
#
# SPDX-License-Identifier: MIT
# 
# Receive message from IOTA tangle
#

import iota_client
import os
import pprint

# Config
message_id = '497c1b68e5480d07819bbd9c989c8d245fa748667a89fdf7dac884741f493326'
node_info = False
msg_meta = False
env_node_address = 'HORNET_NODE_ADDRESS'


# Print Message data
def show_message(message, meta=False):
    if meta:
        show = 'Message meta'
    else:
        show = 'Message'
    print(
    '''
    {} data:

    '''.format(show))

    pprint.pprint(message)


# Connect to node and retrieve message
def main():
    # Get node address out of environment
    NODE_URL = os.getenv(env_node_address)
    if not NODE_URL:
        raise Exception("Please define environment variable with node URL.")

    try:
        # Initialize client
        client = iota_client.Client(
            nodes_name_password=[[NODE_URL]], node_sync_disabled=True)
    except:
        raise Exception('Node not found.')
    
    # Check node status
    if not client.get_health():
        print('''
        ------------------
        Node not healthy.
        ------------------''')

    # Get node information
    if node_info:
        print('Node Information:')
        pprint.pprint(client.get_info())

    # Retrieve message from Tangle
    message = client.get_message_data(message_id)

    # Show results
    show_message(message)
    
    if msg_meta:
        message_meta = client.get_message_metadata(message_id)
        show_message(message_meta, True)

    # Decode message
    msg_str = bytes(message['payload']['indexation'][0]['data']).decode('utf-8')

    print('''
        Decoded message:
    
        {}
        
    '''.format(msg_str))

if __name__ == "__main__":
    main()