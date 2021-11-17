# iota-and-iot

## Description

The project goal is  to enable communication between different IoT participants using the IOTA layer. 
The focus is on ensuring data integrity as well as authorization and authentication of participants. 

## ToDo

- [x] Setting up and running Hornet node
- [x] Sending and retrieving message date from tangle
- [ ] Setting up secure secret storage
- [ ] Using streams to send and retrieve data
- [ ] Testing authorization, authentication and data integrity


## Installation

```
Tested on:
OS: Windows 10, 
Python: 3.9.7, 
iota-client: 0.2.0a8,
```


```
python3 -m venv venv
.\venv\Scripts\activate or source ./venv/bin/activate
pip install -r requirements.txt

Add environment variable named 'HORNET_NODE_ADDRESS' with node URL (https://<someAddressOrIP>:<Port>)
```
## Run example

Run:
```
>>> python send_msg.py --msg "Your message" 

  Message send!
  Please check message on https://explorer.iota.org/mainnet/message/a5c3cd58680924e6480d105adfe23a23a00b735dba37b003020bad25e1825dc7

  Message details:

  {'message_id': '<your_msg_id>',
  ...

>>> python receive_msg.py --msg_id <your_msg_id> 

    Message data:


    {'message_id': <your_msg_id>,
    ...
    'payload': {'indexation': [{'data': [80,
                                      114,
                                      111,
                                      ...
```

Or check an example on the tangle:

>[Check already attached messasge](https://explorer.iota.org/mainnet/message/497c1b68e5480d07819bbd9c989c8d245fa748667a89fdf7dac884741f493326)

## Doc

```
usage: receive_msg.py [-h] [--msg_id MSG_ID] [--node_info NODE_INFO]

Receive message from IOTA tangle.

optional arguments:
  -h, --help            show this help message and exit
  --msg_id MSG_ID       Id of message stored on tangle
  --node_info NODE_INFO


usage: send_msg.py [-h] [--msg MSG] [--node_info NODE_INFO] [--indx INDX]

Send message to IOTA tangle.

optional arguments:
  -h, --help            show this help message and exit
  --msg MSG             Message to send
  --node_info NODE_INFO
                        Print node information
  --indx INDX           Set indexation for message
```

## Installation and configuration of a hornet node

Setting up a hornet node with reverse proxy and SSL certificate:

  [Klick](hornet-node/)

## Build application uppon IOTA layer

### Streams

ToDo: Create Pub/Sub system with streams


## Source

* [IOTA](https://www.iota.org/)
* [IOTA Client Docs](https://wiki.iota.org/iota.rs/libraries/python/examples)
* [Tangle Explorer](https://explorer.iota.org/mainnet/)
* [IOTA Streams](https://github.com/iotaledger/streams)
