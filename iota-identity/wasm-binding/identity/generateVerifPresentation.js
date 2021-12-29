/* generateVerifPresentation.js
*
*  SPDX-FileCopyrightText: Copyright 2021 Fabbio Protopapa
*  SPDX-License-Identifier: MIT
*
*  ToDo: 
*
*/
const { KeyPair } = require("@iota/identity-wasm/node");

var identity = require('./identity');

async function main() {
    /*
    5. Holder creates verifiable presentation
    */
    //Issue and sign verifiable credential from weakhold object
    console.log("---------------------------------------------------------");
    console.log("--------- Create Verifiable Presentations ---------------");
    console.log("---------------------------------------------------------");

    console.log("--------------------------------------------------------");
    console.log("----------------- Author VP ----------------------------");
    console.log("--------------------------------------------------------");

    let holderAuthor = await identity.getWeakholdObject('./weakhold/Author.json');
    let holderAuthorVerificationMethod = "AuthorPresentation";
    let signedVcPath = './signed_credentials/offlineVerifiableCredential' + holderAuthor.subject + '.json';
    await identity.createVerifiablePresentation(
        holderAuthor.subject,
        holderAuthor.did,
        KeyPair.fromJSON(holderAuthor.verifKey),
        holderAuthorVerificationMethod,
        signedVcPath);

    console.log("--------------------------------------------------------");
    console.log("----------------- Freight Forwarder VP -----------------");
    console.log("--------------------------------------------------------");

    let holderFreightForwarder = await identity.getWeakholdObject('./weakhold/FreightForwarder.json');
    let holderFreightForwarderVerificationMethod = "FFPresentation";
    signedVcPath = './signed_credentials/offlineVerifiableCredential' + holderFreightForwarder.subject + '.json';
    await identity.createVerifiablePresentation(
        holderFreightForwarder.subject,
        holderFreightForwarder.did,
        KeyPair.fromJSON(holderFreightForwarder.verifKey),
        holderFreightForwarderVerificationMethod,
        signedVcPath);

    console.log("--------------------------------------------------------");
    console.log("----------------- Shipper VP ---------------------------");
    console.log("--------------------------------------------------------");

    let holderShipper = await identity.getWeakholdObject('./weakhold/Shipper.json');
    let holderShipperVerificationMethod = "ShipperPresentation";
    signedVcPath = './signed_credentials/offlineVerifiableCredential' + holderShipper.subject + '.json';
    await identity.createVerifiablePresentation(
        holderShipper.subject,
        holderShipper.did,
        KeyPair.fromJSON(holderShipper.verifKey),
        holderShipperVerificationMethod,
        signedVcPath);

    console.log("--------------------------------------------------------");
    console.log("----------------- Consignee VP -------------------------");
    console.log("--------------------------------------------------------");

    let holderConsignee = await identity.getWeakholdObject('./weakhold/Consignee.json');
    let holderConsigneeVerificationMethod = "ConsigneePresentation";
    signedVcPath = './signed_credentials/offlineVerifiableCredential' + holderConsignee.subject + '.json';
    await identity.createVerifiablePresentation(
        holderConsignee.subject,
        holderConsignee.did,
        KeyPair.fromJSON(holderConsignee.verifKey),
        holderConsigneeVerificationMethod,
        signedVcPath);

    console.log("--------------------------------------------------------");
    console.log("----------------- Cargo VP -----------------------------");
    console.log("--------------------------------------------------------");

    let holderCargo = await identity.getWeakholdObject('./weakhold/Cargo.json');
    let holderCargoVerificationMethod = "CargoPresentation";
    signedVcPath = './signed_credentials/offlineVerifiableCredential' + holderCargo.subject + '.json';
    await identity.createVerifiablePresentation(
        holderCargo.subject,
        holderCargo.did,
        KeyPair.fromJSON(holderCargo.verifKey),
        holderCargoVerificationMethod,
        signedVcPath);
    /*
    6. Check verifiable presentation
    */
    console.log("---------------------------------------------------------");
    console.log("--------- Check Verifiable Presentations ----------------");
    console.log("---------------------------------------------------------");

    console.log("--------------------------------------------------------");
    console.log("----------------- Check Cargo VP -----------------------");
    console.log("--------------------------------------------------------");

    let signedVpPath = './signed_credentials/offlineVerifiablePresentation' + holderCargo.subject + '.json';
    await identity.checkVerifiablePresentation(signedVpPath);

    console.log("--------------------------------------------------------");
    console.log("----------------- Check Shipper VP ---------------------");
    console.log("--------------------------------------------------------");

    signedVpPath = './signed_credentials/offlineVerifiablePresentation' + holderShipper.subject + '.json';
    await identity.checkVerifiablePresentation(signedVpPath);

    console.log("--------------------------------------------------------");
    console.log("----------------- Check Author VP ----------------------");
    console.log("--------------------------------------------------------");

    signedVpPath = './signed_credentials/offlineVerifiablePresentation' + holderAuthor.subject + '.json';
    await identity.checkVerifiablePresentation(signedVpPath);

    console.log("--------------------------------------------------------");
    console.log("----------------- Check Freight Forwarder VP -----------");
    console.log("--------------------------------------------------------");

    signedVpPath = './signed_credentials/offlineVerifiablePresentation' + holderFreightForwarder.subject + '.json';
    await identity.checkVerifiablePresentation(signedVpPath);

    console.log("--------------------------------------------------------");
    console.log("----------------- Check Consignee VP -------------------");
    console.log("--------------------------------------------------------");

    signedVpPath = './signed_credentials/offlineVerifiablePresentation' + holderConsignee.subject + '.json';
    await identity.checkVerifiablePresentation(signedVpPath);
}

main();