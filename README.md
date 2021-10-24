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

https://github.com/gohornet/hornet

https://hochrhein-engineering.com/2021/04/18/build-and-run-iota-hornet-node/

https://hornet.docs.iota.org/post_installation/peering


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

