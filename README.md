# iota-and-iot

## Installation

OS: Windows 10, 
Python: 3.9.7, 
PyOTA: 2.1.0,

```
python -m venv venv
.\venv\Scripts\activate 
pip install pyota
```
## Write data

Run:
```
python iota_send_message.py
```

Or:

[Check already attached messasge](https://explorer.iota.org/legacy-devnet/transaction/TXBQO9M9KCYHZPJCTHJRWNESBXJGPCBDZJPLURJYTTGJLQRHQSHTIVHNWOTINYB9HMFEPVMVMOZVTZ999)

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

