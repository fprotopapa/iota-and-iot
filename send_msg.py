# send_msg.py
#
# SPDX-FileCopyrightText: Copyright 2021 Fabbio Protopapa
#
# SPDX-License-Identifier: MIT
# 
# Send a message to the IOTA tangle
# For e.g.
# https://explorer.iota.org/mainnet/message/497c1b68e5480d07819bbd9c989c8d245fa748667a89fdf7dac884741f493326
#

import iota_client
import os
import pprint

# Config
message_str = 'Projekt badawczy - IOTA w IoT'
indexation = 'Hello'
env_node_address = 'HORNET_NODE_ADDRESS'
node_info = False


# Print Message data
def show_message(message):
    print('''
    Message send!
    Please check message on https://explorer.iota.org/mainnet/message/{}

    Message details:
    '''.format(message['message_id']))
    pprint.pprint(message)


# Connect to node and send message
def main():
    NODE_URL = SEED = os.getenv(env_node_address)
    if not NODE_URL:
        raise Exception("Please define environment variable with node URL.")

    try:
        # Initialize client
        client = iota_client.Client(
        nodes_name_password=[[NODE_URL]], node_sync_disabled=True)
    except:
        raise Exception('Node not found.')

    # Get node information
    if node_info:
        print('Node Information:')
        pprint.pprint(client.get_info())
        print('----------------------------------------------------------')

    # Create message
    message_byte = message_str.encode("utf8")
    message_id_indexation = client.message(
        index=indexation, data=message_byte)

    # Print send message
    show_message(message_id_indexation)




if __name__ == "__main__":
    main()
