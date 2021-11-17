# IOTA Streams - WASM-binding

Use WASM binding for IOTA Streams.

## Install

```
Tested on:
OS: Ubuntu 20.04 LTS / WSL2 (Windows 10), 
Python: 3.9.7, 
iota-streams v0.1.2 (v1.2),
rustc 1.56.1 (59eed8a2a 2021-11-01),
nvm v16.13.0,
npm 8.1.0,
node v16.13.0,
```

```
# Open PowerShell and start WSL
wsl
cd ~

# Install Rust for WSL2
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install nvm, npm and node  
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
# Restart terminal
nvm install --lts

# Clone repository
git clone https://github.com/fprotopapa/iota-and-iot.git
cd ./iota-and-iot

# Clone IOTA Streams
git clone https://github.com/iotaledger/streams.git

cd streams/bindings/wasm/

# Generate binding, is created in ./node
npm install
npm run build:nodejs

# Change webpack configuration
nano webpack.config.js
# Change:
...
devServer: {
    contentBase: dist,
...
# To:
...
devServer: {
    static: dist,
...

# Test binding (http://localhost:8080)
npm run serve
```

## Export binding

```
# Copy files to new directory
cp <path_to_streams>/streams/bindings/wasm/node{streams_bg.wasm,streams.d.ts,streams.js} <new_path>/node/
cp <path_to_streams>/streams/bindings/wasm/package.json <new_path>/
cd <new_path>
touch node.js
# Install dependencies
npm install

# Add code to node.js
>>> nano touch node.js

const streams = require("./node/streams");

streams.set_panic_hook();

async function main() {
  let node = "https://chrysalis-nodes.iota.org/";
  ...
}

# And run application
node node.js
```

## Source
* [Docs](https://wiki.iota.org/streams/libraries/wasm/getting_started)
