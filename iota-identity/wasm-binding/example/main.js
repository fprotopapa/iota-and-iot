const identity = require('@iota/identity-wasm/node')

// Generate a new KeyPair
const key = new identity.KeyPair(identity.KeyType.Ed25519)

// Create a new DID Document with the KeyPair as the default verification method
const doc = new identity.Document(key)
// const doc = new identity.Document(key, "dev") // if using the devnet

// Sign the DID Document with the private key
doc.sign(key, doc.id.toString());

// Create a default client instance for the mainnet
const config = identity.Config.fromNetwork(identity.Network.mainnet());
// const config = identity.Config.fromNetwork(identity.Network.devnet()); // if using the devnet
const client = identity.Client.fromConfig(config);

// Publish the DID Document to the IOTA Tangle
// The message can be viewed at https://explorer.iota.org/<mainnet|devnet>/transaction/<messageId>
client.publishDocument(doc)
    .then((receipt) => {
        // let explorer = identity.ExplorerUrl.devnet(); // if using the devnet
        console.log("Tangle Message Receipt: ", receipt)
        console.log("Tangle Message Url:https://explorer.iota.org/mainnet/transaction/", receipt.messageId)
    })
    .catch((error) => {
        console.error("Error: ", error)
        throw error
    })