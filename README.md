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

## Install Hornet node

```
Tested on:
OS: Debian 10 (Buster),
HORNET: 1.0.5
```

Install Hornet node:

```
Hardware recommendation: 

4 cores or 4 vCPU
8 GB RAM
SSD storage
A public IP address
```


```
# Install Hornet node
sudo apt update
sudo apt install hornet

sudo systemctl enable hornet.service
sudo service hornet start
```

Install nginx:

For an e.g. nginx config file [look here](nginx/default).
```
# Setup nginx as reverse server and Let's Encrypt for SSL

sudo apt-get install nginx

# Edit config file at /etc/nginx/sites-available/default
```

Get SSL Certificate from Let's Encrypt (URL needed):

Follow newest tutorial on [certbot](https://certbot.eff.org/lets-encrypt/debianbuster-nginx) for SSL certificate.


Configure Hornet:

```
>>> sudo nano /var/lib/hornet/config.json

# E.g. configuration for Rest API
{
  "restAPI": {
    "bindAddress": "0.0.0.0:14265",
    "jwtAuth": {
      "enabled": false,
      "salt": "HORNET"
    },
    "excludeHealthCheckFromAuth": false,
    "permittedRoutes": [
      "/health",
      "/mqtt",
      "/api/v1/info",
      "/api/v1/tips",
      "/api/v1/messages/:messageID",
      "/api/v1/messages/:messageID/metadata",
      "/api/v1/messages/:messageID/raw",
      "/api/v1/messages/:messageID/children",
      "/api/v1/messages",
      "/api/v1/transactions/:transactionID/included-message",
      "/api/v1/milestones/:milestoneIndex",
      "/api/v1/milestones/:milestoneIndex/utxo-changes",
      "/api/v1/outputs/:outputID",
      "/api/v1/addresses/:address",
      "/api/v1/addresses/:address/outputs",
      "/api/v1/addresses/ed25519/:address",
      "/api/v1/addresses/ed25519/:address/outputs",
      "/api/v1/treasury"
    ],
    "whitelistedAddresses": [
      "127.0.0.1",
      "::1"
    ],
    
    # E.g. configuration for Rest API
    # Create User, Hash and salt
    # Hash and Salt can be created via command
    # >>> hornet tool pwd-hash
    "dashboard": {
    "bindAddress": "localhost:8081",
    "dev": false,
    "auth": {
      "sessionTimeout": "72h",
      "username": "<your_user>",
      "passwordHash": "<your_hash>",
      "passwordSalt": "<your_salt>"
    }
    
  # Enable  autopeering
  "node": {
    "alias": "HORNET mainnet node",
    "profile": "auto",
    "disablePlugins": [],
    "enablePlugins": [
      "Spammer",
      "Autopeering"
    ]
  },

>>> sudo systemctl restart hornet
```

Set firewall access (for e.g. ufw):

```
apt install ufw
ufw default allow outgoing
ufw default deny incoming
ufw allow <Port>
ufw enable


```

Useful and mandatory ports:

```
<SSH_Port>                 ALLOW       Anywhere # SSH
443                        ALLOW       Anywhere # SSL
80                         ALLOW       Anywhere # HTTP
15600/tcp                  ALLOW       Anywhere # Gossip
14626/udp                  ALLOW       Anywhere # Autopeering
<Rest API>                 ALLOW       Anywhere # Rest API (redirect through nginx)
```

Test Rest API:

```
>>> curl https://address-to-node:port-of-rest-api/api/v1/info

{"data":
{"name":"HORNET","version":"1.0.5","isHealthy":true,"networkId":"chrysalis-mainnet","bech32HRP":"iota","minPoWScore":4000,"messagesPerSecond":10,
"referencedMessagesPerSecond":11.5,"referencedRate":114.99999999999999,"latestMilestoneTimestamp":1635095521,"latestMilestoneIndex":1541666,
"confirmedMilestoneIndex":1541666,"pruningIndex":1540081,"features":["PoW"]}}
```


## Build application uppon IOTA layer

### Streams

ToDo: Create Pub/Sub system with streams


## Source

* [IOTA HORNET Node Installation Party - June 5th, 2020](https://www.youtube.com/watch?v=nfBhdRCV2kw)
* [IOTA](https://www.iota.org/)
