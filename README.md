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

[Check already attached messasge](https://explorer.iota.org/mainnet/message/497c1b68e5480d07819bbd9c989c8d245fa748667a89fdf7dac884741f493326)

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

## Run node

### Create Bee node
Follow instructions:

https://bee.docs.iota.org/configuration#protocol

https://github.com/iotaledger/bee/tree/chrysalis-pt-2/bee-node

Create key 

..\target\release\bee p2p-identity

Copy Private Key to config.toml -> Identity

Run node

..\target\release\bee

### Hornet

OS: Debian 10 (Buster)

https://hornet.docs.iota.org/getting_started/hornet_apt_repository

Use nginx as reverse proxy:

sudo apt-get install nginx
Let's encrypt : https://certbot.eff.org/lets-encrypt/debianbuster-nginx

https://medium.com/@jort.debokx/how-to-setup-https-for-your-iota-full-node-106f829ba2f1

https://www.youtube.com/watch?v=nfBhdRCV2kw

https://github.com/gohornet/hornet

https://hochrhein-engineering.com/2021/04/18/build-and-run-iota-hornet-node/

https://hornet.docs.iota.org/post_installation/peering

https://nodesharing.wisewolf.de/ or use autopeering (enable port and plugin) https://github.com/massyu/hornet#autopeering

Query Rest Api:

curl https://address-to-node:port-of-rest-api/api/v1/info

{"data":{"name":"HORNET","version":"1.0.5","isHealthy":true,"networkId":"chrysalis-mainnet","bech32HRP":"iota","minPoWScore":4000,"messagesPerSecond":10,"referencedMessagesPerSecond":11.5,"referencedRate":114.99999999999999,"latestMilestoneTimestamp":1635095521,"latestMilestoneIndex":1541666,"confirmedMilestoneIndex":1541666,"pruningIndex":1540081,"features":["PoW"]}}


### Streams

https://github.com/iotaledger/streams-examples/tree/master/src/examples/single_publisher

https://legacy.docs.iota.org/docs/iota-streams/1.1/overview

https://roadmap.iota.org/streams

https://github.com/adrian-grassl/iota-streams-tutorial

https://github.com/iotaledger/streams-examples/tree/master/src/examples/single_publisher

https://github.com/iot2tangle/Streams-mqtt-gateway

https://github.com/ggreeve/IOTA-Trust-Drinking-Water

### Libraries

https://wiki.iota.org/iota.rs/libraries/python/api_reference#mqtt-apis

https://chrysalis.docs.iota.org/libraries/client


# Installation: https://client-lib.docs.iota.org/docs/libraries/python/getting_started/
# https://client-lib.docs.iota.org/docs/libraries/python/api_reference

