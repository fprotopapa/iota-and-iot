/* identity.js
*
*  SPDX-FileCopyrightText: Copyright 2021 Fabbio Protopapa
*  SPDX-License-Identifier: MIT
*
*  ToDo: 
*
*/

/*
1. Create DID (Shipper, Consignee, Freight Forwarder, Cargo, Author, DID-Thrusty)



*/
const { Document, KeyType, Client, Config, VerifiableCredential } = require("@iota/identity-wasm/node");
const { DID, KeyPair, VerificationMethod, Digest, KeyCollection, VerifiablePresentation } = require("@iota/identity-wasm/node");
const { Network, defaultNodeURL, explorerURL } = require('@iota/identity-wasm/node');
const fs = require('fs').promises;
//const { writeFileSync, readFileSync } = require('fs');

module.exports = {
    setClientConfig,
    createVerifiableCredential,
    addVerificationMethod,
    createDid,
    resolveDid,
    storeWeakholdObject,
    getWeakholdObject,
    getExplorerUrl,
    checkVerifiableCredential,
    checkVerifiablePresentation,
    createVerifiablePresentation,
    removeVerificationMethod,
    removeMerkleKey
}

const MAINNET = Network.mainnet();
const CLIENT_CONFIG = {
    network: MAINNET,
    defaultNodeURL: MAINNET.defaultNodeURL,
    explorerURL: MAINNET.explorerURL,
};

function setClientConfig(main=true, url=null){
    if (main) {
        const mainnet = Network.mainnet();
        const CLIENT_CONFIG = {
        network: mainnet,
        defaultNodeURL: mainnet.defaultNodeURL,
        explorerURL: mainnet.explorerURL,
        };
    } else {
        const CLIENT_CONFIG = {
            network: Network.mainnet(),
            defaultNodeURL: url,
            explorerURL: Network.mainnet().explorerURL,
        };
    }
}

async function createVerifiableCredential(issuerSubject, issuerDid, issuerVerifKey, issuerVerificationMethod,  holderDid, holderSubject, subjectCode, merkleKey) {
    //Resolve existing DID document object and corresponding messageId
    let resolvedIssuerDid = await resolveDid(issuerDid);

    //Create DID document instance
    let issuerDoc = Document.fromJSON(resolvedIssuerDid.document);

    //Create credential 
    const credentialSubject = {
        "id": holderDid,
        "name": holderSubject,
        "code": subjectCode
    }
    //Log newly created credential document
    console.log('\n',`This is ${holderSubject}'s credential document indicating her degree, but this doesn't prove anything so far:`);
    console.log(credentialSubject)

    // Create an unsigned credential 
    const unsignedVc = VerifiableCredential.extend({
        id: "http://somenicelink.com",
        type: "Projekt Badawczy",
        issuer: issuerDid,
        credentialSubject,
    });
    //Log unsigned verifiable credential
    console.log('\n',`This is the unsigned verifiable credential, containing the credential document:`);
    console.log(unsignedVc);

    //Sign the credential with the first key in the Merkle key collection of the Issuer's new verification method
    const signedVc = issuerDoc.signCredential(unsignedVc, {
        method: issuerDid+"#"+issuerVerificationMethod,
        public: issuerVerifKey.public(merkleKey),
        secret: issuerVerifKey.secret(merkleKey),
        proof: issuerVerifKey.merkleProof(Digest.Sha256, merkleKey)
    });
    //Log signed verifiable credential
    console.log('\n',`This is the verifiable credential signed by ${issuerSubject}, using the key pair of the previously created verification method '${issuerVerificationMethod}':`);
    console.log(signedVc);

    //Write signed verifiable credential to file in pretty-printed JSON format
    let vcFilepath = './signed_credentials/offlineVerifiableCredential' + holderSubject + '.json';
    try {
        await fs.writeFile(vcFilepath, JSON.stringify(signedVc, null, 4));
    } catch (err) {
        console.error(err)
    }

    return {signedVc};
}

async function addVerificationMethod(subjectName, did, authKey, verificationMethodName, merkleKeys = false) {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(CLIENT_CONFIG.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    //Resolve existing DID document object and corresponding messageId
    let resolvedDid = await resolveDid(did);

    let messageId = resolvedDid.messageId

    //Set Did Document field "updated" to current timestamp as ISO 8601 string without milliseconds
    resolvedDid.document.updated = (new Date()).toISOString().split('.')[0]+"Z";

    //Create DID document instance
    let issuerDoc = Document.fromJSON(resolvedDid.document);


    //Create single key pair or set of merkle keys depending on passed parameter "merkleKeys"
    let newKeys = {};
    let method = {};

    if (merkleKeys === false) {
        //Create new verification method with single key pair
        newKeys = new KeyPair(KeyType.Ed25519);
        method = VerificationMethod.fromDID(issuerDoc.id, newKeys, verificationMethodName);
    } else {
        //Create new verification method with merkle key collection of 8 keys (Must be a power of 2)
        newKeys = new KeyCollection(KeyType.Ed25519, 8);
        method = VerificationMethod.createMerkleKey(Digest.Sha256, issuerDoc.id, newKeys, verificationMethodName);
    }

    //Remove method if already exists, create new method
    issuerDoc.removeMethod(DID.parse(issuerDoc.id.toString()+"#"+verificationMethodName));
    issuerDoc.insertMethod(method, "VerificationMethod");

    //Add the messageId of the previous message in the chain.
    //This is REQUIRED in order for the messages to form a chain.
    //Skipping / forgetting this will render the publication useless.

    issuerDoc.previousMessageId = messageId;

    //Sign the DID Document with the appropriate key
    issuerDoc.sign(authKey);

    //Log updated DID document
    console.log('\n',`This is ${subjectName}'s updated DID document, with the new verification method '${verificationMethodName}'`);
    console.log(issuerDoc);

    //Publish the Identity to the IOTA Network, this may take a few seconds to complete Proof-of-Work.
    const nextMessageId = await client.publishDocument(issuerDoc.toJSON());

    //Store new DID keys to weakhold
    await storeWeakholdObject(subjectName, issuerDoc, nextMessageId, authKey, verificationMethodName, newKeys);

    return {};
}

async function createDid(subjectName) {
    //Create a DID Document (an identity).
    const { doc, key } = new Document(KeyType.Ed25519, CLIENT_CONFIG.network.toString())

    //Sign the DID Document with the generated key
    doc.sign(key);

    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(CLIENT_CONFIG.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    //Publish the Identity to the IOTA Network, this may take a few seconds to complete Proof-of-Work.
    const messageId = await client.publishDocument(doc.toJSON());

    //Log newly created DID document
    console.log('\n',`This is ${subjectName}'s DID document, which is now immutably stored on the IOTA Tangle:`);
    console.log('\x1b[36m%s\x1b[0m', getExplorerUrl(CLIENT_CONFIG.network.toString(), messageId));
    console.log(doc);

    //Store Did information to Weakhold and log to console
    await storeWeakholdObject(subjectName, doc, messageId, key, null);

    //Return the results
    return {key, doc, messageId};
}

async function resolveDid(did) {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(CLIENT_CONFIG.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    // Resolve a DID.
    let resolvedDid = await client.resolve(did);
    
    return resolvedDid;
}

//Logs relevant Did information
async function storeWeakholdObject(holder, doc, messageId, authKey, verificationMethodName = null, verifKey = null) {
    let yourDid = {}

    yourDid['subject'] = holder;
    yourDid['did'] = JSON.parse(doc).id;
    yourDid['messageId'] = messageId;
    yourDid['explorerUrl'] = getExplorerUrl(CLIENT_CONFIG.network.toString(), messageId);
    yourDid.authKey = authKey;

    if (verifKey !== null) {
    yourDid.verifKey = verifKey;
    yourDid.verifKey.methodName = verificationMethodName;
    }

    //Write Did Information to weakhold
    let didPath = `./weakhold/${holder}.json`.replace(/\s/g, '');
    try {
        await fs.writeFile(didPath, JSON.stringify(yourDid, null, 4))
        console.log('\n',`The associated keys to proof ownership of ${holder}'s DID were stored/updated to this weakhold file: ${didPath}`)
        console.log(yourDid);
    } catch (err) {
        console.error(err)
    }
}

async function getWeakholdObject(weakholdFilePath) {
    //Read weakhold object from file
    let weakholdObject = JSON.parse(await fs.readFile(weakholdFilePath));
    return(weakholdObject);
}

function getExplorerUrl(network, messageId) {
    return(`https://explorer.iota.org/${network}net/message/${messageId}`);
}

async function checkVerifiableCredential(vcPath) {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(CLIENT_CONFIG.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    //Read signed credential from file
    let signedVc = VerifiableCredential.fromJSON(JSON.parse(await fs.readFile(vcPath)));
    
    //Check if the credential is verifiable
    const result = await client.checkCredential(signedVc.toString(), CLIENT_CONFIG);
    console.log(`Verifiable credential verification result: ${result.verified}`);
}

async function checkVerifiablePresentation(vpPath) {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(CLIENT_CONFIG.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    //Read signed credential from file
    let signedVp = VerifiablePresentation.fromJSON(JSON.parse(await fs.readFile(vpPath)));
    
    //Check if the credential is verifiable
    const result = await client.checkPresentation(signedVp.toString());
    console.log(`Verifiable presentation verification result: ${result.verified}`);
}

async function createVerifiablePresentation(holderSubject, holderDid, holderVerifKey, holderVerificationMethod, vcPath) {
    //Resolve existing DID document object and corresponding messageId
    let resolvedIssuerDid = await resolveDid(holderDid);

    //Create DID document instance
    let holderDoc = Document.fromJSON(resolvedIssuerDid.document);
    
    //Read signed credential from file
    let signedVc = VerifiableCredential.fromJSON(JSON.parse(await fs.readFile(vcPath)));

    // Create a Verifiable Presentation from the Credential - signed by Alice's key
    const unsignedVp = new VerifiablePresentation(holderDoc, signedVc.toJSON())
    //Log unsigned verifiable credential
    console.log('\n',`This is ${holderSubject}'s unsigned verifiable presentation, containing the verifiable credential previously created:`);
    console.log(unsignedVp);


    const signedVp = holderDoc.signPresentation(unsignedVp, {
        method: "#"+holderVerificationMethod,
        secret: holderVerifKey.secret,
    })
    //Log signed verifiable credential
    console.log('\n',`This is the verifiable presentation signed by ${holderSubject}, using the key pair of the previously created verification method '${holderVerificationMethod}':`);
    console.log(signedVp);

    //Write signed verifiable presentation to file in pretty-printed JSON format
    let vpFilepath = './signed_credentials/offlineVerifiablePresentation' + holderSubject + '.json';
    try {
        await fs.writeFile(vpFilepath, JSON.stringify(signedVp, null, 4))
        } catch (err) {
        console.error(err)
        }

    return {signedVp};
}

async function removeVerificationMethod(issuerSubject, issuerDid, issuerAuthKey, verificationMethodName ) {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(CLIENT_CONFIG.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    //Resolve existing DID document object and corresponding messageId
    let resolvedIssuerDid = await resolveDid(issuerDid);
    let messageId = resolvedIssuerDid.messageId

    //Set Did Document field "updated" to current timestamp as ISO 8601 string without milliseconds
    resolvedIssuerDid.document.updated = (new Date()).toISOString().split('.')[0]+"Z";

    //Create DID document instance
    let issuerDoc = Document.fromJSON(resolvedIssuerDid.document);

    //Remove the public key that signed the VC - effectively revoking the VC as it will no longer be able to verify
    issuerDoc.removeMethod(DID.parse(issuerDoc.id.toString()+"#"+verificationMethodName ));
    issuerDoc.previousMessageId = messageId;
    issuerDoc.sign(issuerAuthKey);

    //Log updated DID document
    console.log('\n',`This is ${issuerSubject}'s updated DID document. Note that the verifaction method '${verificationMethodName }' was removed:`);
    console.log(issuerDoc);

    //Publish the Identity to the IOTA Network, this may take a few seconds to complete Proof-of-Work.
    const nextMessageId = await client.publishDocument(issuerDoc.toJSON());

    //Store new DID keys to weakhold
    await storeWeakholdObject(issuerSubject, issuerDoc, nextMessageId, issuerAuthKey, null);
}

async function removeMerkleKey(issuerSubject, issuerDid, issuerAuthKey, verificationMethodName, issuerVerifKeys) {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(CLIENT_CONFIG.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    //Resolve existing DID document object and corresponding messageId
    let resolvedIssuerDid = await resolveDid(issuerDid);
    let messageId = resolvedIssuerDid.messageId

    //Set Did Document field "updated" to current timestamp as ISO 8601 string without milliseconds
    resolvedIssuerDid.document.updated = (new Date()).toISOString().split('.')[0]+"Z";

    //Create DID document instance
    let issuerDoc = Document.fromJSON(resolvedIssuerDid.document);
    console.log(issuerDoc);

    //Remove the public key that signed the VC - effectively revoking the VC as it will no longer be able to verify
    issuerDoc.revokeMerkleKey(verificationMethodName, 0);
    issuerDoc.previousMessageId = messageId;
    issuerDoc.sign(issuerAuthKey);

    //Log updated DID document
    console.log('\n',`This is ${issuerSubject}'s updated DID document.`);
    console.log(issuerDoc);

    //Publish the Identity to the IOTA Network, this may take a few seconds to complete Proof-of-Work.
    const nextMessageId = await client.publishDocument(issuerDoc.toJSON());

    //Store new DID keys to weakhold
    await storeWeakholdObject(issuerSubject, issuerDoc, nextMessageId, issuerAuthKey, verificationMethodName, issuerVerifKeys);
}

async function mainsads() {
    // let issuer = await getWeakholdObject('./weakhold/UniversityofOslo.json');
    // console.log("--------------------------------------------------")
    // console.log(issuer.verifKey)
    /*
    1. Create DIDs (Shipper, Consignee, Freight Forwarder, Cargo, Author, Authority)
    */
    // createDid('Shipper');
    // createDid('Consignee');
    // createDid('FreightForwarder');
    // createDid('Cargo');
    // createDid('Author');
    // createDid('Authority');
    console.log("--------------------------------------------------------");
    console.log("----------------- Create DID ---------------------------");
    console.log("--------------------------------------------------------");
    await createDid('Alice');
    await createDid('University of Oslo');
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(5000);
    let issuer = await getWeakholdObject('./weakhold/UniversityofOslo.json');
    let issuerVerificationMethod = "degreeVerifications";

    /*
    2. Add verification
    */
    console.log("--------------------------------------------------------");
    console.log("----------------- Add Verification Method --------------");
    console.log("--------------------------------------------------------");
    await addVerificationMethod(
        issuer.subject,
        issuer.did,
        KeyPair.fromJSON(issuer.authKey),
        issuerVerificationMethod,
        true);

    //Add verification method to holder DID
    let holder = await getWeakholdObject('./weakhold/Alice.json')
    let holderVerificationMethod = "aliceDegreePresentation";

    await addVerificationMethod(
        holder.subject,
        holder.did,
        KeyPair.fromJSON(holder.authKey),
        holderVerificationMethod,
        false);
    /*
    3. Create Verifiable Credentials
    */
    console.log("--------------------------------------------------------");
    console.log("--------- Create Verifiable Credentials ----------------");
    console.log("--------------------------------------------------------");
    //Issue and sign verifiable credential from weakhold object
    issuer = await getWeakholdObject('./weakhold/UniversityofOslo.json');
    console.log(issuer.verifKey)
    await createVerifiableCredential(
        issuer.subject,
        issuer.did,
        KeyCollection.fromJSON(issuer.verifKey),
        issuerVerificationMethod,
        holder.did,
        holder.subject);
    /*
    4. Holder check if issuer verified credentials
    */
    console.log("--------------------------------------------------------");
    console.log("--------- Check Verifiable Credentials -----------------");
    console.log("--------------------------------------------------------");
    await delay(5000);
    let signedVcPath = './signed_credentials/offlineVerifiableCredential.json';
    await checkVerifiableCredential(signedVcPath);
    /*
    5. Holder creates verifiable presentation
    */
    //Issue and sign verifiable credential from weakhold object
    console.log("--------------------------------------------------------");
    console.log("--------- Create Verifiable Presentation ---------------");
    console.log("--------------------------------------------------------");
    await createVerifiablePresentation(
        holder.subject,
        holder.did,
        KeyPair.fromJSON(holder.verifKey),
        holderVerificationMethod,
        signedVcPath);
    /*
    6. Check verifiable presentation
    */
    console.log("--------------------------------------------------------");
    console.log("--------- Check Verifiable Presentation ----------------");
    console.log("--------------------------------------------------------");
    await delay(5000);
    let signedVpPath = './signed_credentials/offlineVerifiablePresentation.json';
    await checkVerifiablePresentation(signedVpPath);
    /*
    7. Remove merkle key 
    */
    console.log("--------------------------------------------------------");
    console.log("--------- Remove Merkle Key ----------------------------");
    console.log("--------------------------------------------------------");
    //Revoke signatures, which used the first key in the Merkle key collection
    let verificationMethodName  = "degreeVerifications";

    await removeMerkleKey(
        issuer.subject,
        issuer.did,
        KeyPair.fromJSON(issuer.authKey),
        verificationMethodName,
        KeyCollection.fromJSON(issuer.verifKey));
    
    /*
    8. Check verifiable presentation again
    */
    console.log("--------------------------------------------------------");
    console.log("--------- Check Verifiable Presentation ----------------");
    console.log("--------------------------------------------------------");
    await checkVerifiablePresentation(signedVpPath);
    /*
        Functions
    */
}