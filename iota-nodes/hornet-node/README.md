# hornet-node

## Description

Instructions for installation and configuration of a hornet node.

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
sudo systemctl start nginx

# Edit config file at /etc/nginx/sites-available/default

sudo systemctl reload nginx
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
     ...
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
    ...
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
    ...
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
<Rest_API>                 ALLOW       Anywhere # Rest API (redirect through nginx)
```

Test Rest API:

```
>>> curl https://address-to-node:port-of-rest-api/api/v1/info

{"data":
{"name":"HORNET","version":"1.0.5","isHealthy":true,"networkId":"chrysalis-mainnet","bech32HRP":"iota","minPoWScore":4000,"messagesPerSecond":10,
"referencedMessagesPerSecond":11.5,"referencedRate":114.99999999999999,"latestMilestoneTimestamp":1635095521,"latestMilestoneIndex":1541666,
"confirmedMilestoneIndex":1541666,"pruningIndex":1540081,"features":["PoW"]}}
```

Tunnel to node GUI (for e.g. Putty):

```
Session -> Set Host IP and Port
Connection -> SSH -> Auth -> Set Privat Key file path (optional)
Connection -> SSH -> Tunnels -> Source Port 8081 / Destination localhost:8081 & Add

Connect via Putty to server and call in local browser: http://localhost:8081/

Login with user and password set in config.json
```

## Source

* [IOTA HORNET Node Installation Party - June 5th, 2020](https://www.youtube.com/watch?v=nfBhdRCV2kw)
* [Hornet Node](https://hornet.docs.iota.org/welcome)
