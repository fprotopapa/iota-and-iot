/* generateVerifCredentials.js
*
*  SPDX-FileCopyrightText: Copyright 2021 Fabbio Protopapa
*  SPDX-License-Identifier: MIT
*
*  ToDo: 
*
*/
const { KeyCollection } = require("@iota/identity-wasm/node");

var identity = require('./identity');

async function main() {
    /*
    3. Create Verifiable Credentials
    */
    console.log("--------------------------------------------------------");
    console.log("--------- Create Verifiable Credentials ----------------");
    console.log("--------------------------------------------------------");

    console.log("--------------------------------------------------------");
    console.log("----------------- Author VC ----------------------------");
    console.log("--------------------------------------------------------");
    //Issue and sign verifiable credential from weakhold object
    let issuer = await identity.getWeakholdObject('./weakhold/Authority.json');
    let issuerVerificationMethod = "CompanyVerifications";

    let holderAuthor = await identity.getWeakholdObject('./weakhold/Author.json');
    await identity.createVerifiableCredential(
        issuer.subject,
        issuer.did,
        KeyCollection.fromJSON(issuer.verifKey),
        issuerVerificationMethod,
        holderAuthor.did,
        holderAuthor.subject,
        111, // Some Data
        0); // Merkle Key Number * out of 8

    console.log("--------------------------------------------------------");
    console.log("----------------- Cargo VC -----------------------------");
    console.log("--------------------------------------------------------");

    let holderCargo = await identity.getWeakholdObject('./weakhold/Cargo.json');
    await identity.createVerifiableCredential(
        issuer.subject,
        issuer.did,
        KeyCollection.fromJSON(issuer.verifKey),
        issuerVerificationMethod,
        holderCargo.did,
        holderCargo.subject,
        222,
        1);
    console.log("--------------------------------------------------------");
    console.log("----------------- Freight Forwarder VM -----------------");
    console.log("--------------------------------------------------------");

    let holderFreightForwarder = await identity.getWeakholdObject('./weakhold/FreightForwarder.json');
    await identity.createVerifiableCredential(
        issuer.subject,
        issuer.did,
        KeyCollection.fromJSON(issuer.verifKey),
        issuerVerificationMethod,
        holderFreightForwarder.did,
        holderFreightForwarder.subject,
        333,
        2);
    console.log("--------------------------------------------------------");
    console.log("----------------- Consignee VM -------------------------");
    console.log("--------------------------------------------------------");

    let holderConsignee = await identity.getWeakholdObject('./weakhold/Consignee.json');
    await identity.createVerifiableCredential(
        issuer.subject,
        issuer.did,
        KeyCollection.fromJSON(issuer.verifKey),
        issuerVerificationMethod,
        holderConsignee.did,
        holderConsignee.subject,
        444,
        3);
    console.log("--------------------------------------------------------");
    console.log("----------------- Shipper VM ---------------------------");
    console.log("--------------------------------------------------------");

    let holderShipper = await identity.getWeakholdObject('./weakhold/Shipper.json');
    await identity.createVerifiableCredential(
        issuer.subject,
        issuer.did,
        KeyCollection.fromJSON(issuer.verifKey),
        issuerVerificationMethod,
        holderShipper.did,
        holderShipper.subject,
        555,
        4);
    /*
    4. Holder check if issuer verified credentials
    */
    console.log("--------------------------------------------------------");
    console.log("--------- Check Verifiable Credentials -----------------");
    console.log("--------------------------------------------------------");
    
    console.log("--------------------------------------------------------");
    console.log("----------------- Cargo VC -----------------------------");
    console.log("--------------------------------------------------------");

    let signedVcPath = './signed_credentials/offlineVerifiableCredential' + holderCargo.subject + '.json';
    await identity.checkVerifiableCredential(signedVcPath);

    console.log("--------------------------------------------------------");
    console.log("----------------- Shipper VC ---------------------------");
    console.log("--------------------------------------------------------");

    signedVcPath = './signed_credentials/offlineVerifiableCredential' + holderShipper.subject + '.json';
    await identity.checkVerifiableCredential(signedVcPath);

    console.log("--------------------------------------------------------");
    console.log("----------------- Consignee VC -------------------------");
    console.log("--------------------------------------------------------");

    signedVcPath = './signed_credentials/offlineVerifiableCredential' + holderConsignee.subject + '.json';
    await identity.checkVerifiableCredential(signedVcPath);

    console.log("--------------------------------------------------------");
    console.log("----------------- Author VC ----------------------------");
    console.log("--------------------------------------------------------");

    signedVcPath = './signed_credentials/offlineVerifiableCredential' + holderAuthor.subject + '.json';
    await identity.checkVerifiableCredential(signedVcPath);

    console.log("--------------------------------------------------------");
    console.log("----------------- Freight Forwarder VC -----------------");
    console.log("--------------------------------------------------------");

    signedVcPath = './signed_credentials/offlineVerifiableCredential' + holderFreightForwarder.subject + '.json';
    await identity.checkVerifiableCredential(signedVcPath);
  
}

main();