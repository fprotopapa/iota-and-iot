/* generateDids.js
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
    1. Create DIDs (Shipper, Consignee, Freight Forwarder, Cargo, Author, Authority)
    */
    console.log("--------------------------------------------------------");
    console.log("----------------- Create DIDs ---------------------------");
    console.log("--------------------------------------------------------");

    console.log("--------------------------------------------------------");
    console.log("----------------- Shipper DID --------------------------");
    console.log("--------------------------------------------------------");
    await identity.createDid('Shipper');
    console.log("--------------------------------------------------------");
    console.log("----------------- Consignee DID ------------------------");
    console.log("--------------------------------------------------------");
    await identity.createDid('Consignee');
    console.log("--------------------------------------------------------");
    console.log("----------------- Freight Forwarder DID ----------------");
    console.log("--------------------------------------------------------");
    await identity.createDid('FreightForwarder');
    console.log("--------------------------------------------------------");
    console.log("----------------- Cargo DID ----------------------------");
    console.log("--------------------------------------------------------");
    await identity.createDid('Cargo');
    console.log("--------------------------------------------------------");
    console.log("----------------- Author DID ---------------------------");
    console.log("--------------------------------------------------------");
    await identity.createDid('Author');
    console.log("--------------------------------------------------------");
    console.log("----------------- Authority DID ------------------------");
    console.log("--------------------------------------------------------");
    await identity.createDid('Authority');

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(5000);
    /*
    2. Add verification
    */
    console.log("--------------------------------------------------------");
    console.log("----------------- Add Verification Methods --------------");
    console.log("--------------------------------------------------------");

    console.log("--------------------------------------------------------");
    console.log("----------------- Authority VM -------------------------");
    console.log("--------------------------------------------------------");
    let issuer = await identity.getWeakholdObject('./weakhold/Authority.json');
    let issuerVerificationMethod = "CompanyVerifications";

    await identity.addVerificationMethod(
        issuer.subject,
        issuer.did,
        KeyPair.fromJSON(issuer.authKey),
        issuerVerificationMethod,
        true);

    console.log("--------------------------------------------------------");
    console.log("----------------- Shipper VM ---------------------------");
    console.log("--------------------------------------------------------");
    let holderShipper = await identity.getWeakholdObject('./weakhold/Shipper.json');
    let holderShipperVerificationMethod = "ShipperPresentation";

    await identity.addVerificationMethod(
        holderShipper.subject,
        holderShipper.did,
        KeyPair.fromJSON(holderShipper.authKey),
        holderShipperVerificationMethod,
        false);

    console.log("--------------------------------------------------------");
    console.log("----------------- Consignee VM -------------------------");
    console.log("--------------------------------------------------------");
    let holderConsignee = await identity.getWeakholdObject('./weakhold/Consignee.json');
    let holderConsigneeVerificationMethod = "ConsigneePresentation";

    await identity.addVerificationMethod(
        holderConsignee.subject,
        holderConsignee.did,
        KeyPair.fromJSON(holderConsignee.authKey),
        holderConsigneeVerificationMethod,
        false);

    console.log("--------------------------------------------------------");
    console.log("----------------- Freight Forwarder VM -----------------");
    console.log("--------------------------------------------------------");
    let holderFreightForwarder = await identity.getWeakholdObject('./weakhold/FreightForwarder.json');
    let holderFreightForwarderVerificationMethod = "FFPresentation";

    await identity.addVerificationMethod(
        holderFreightForwarder.subject,
        holderFreightForwarder.did,
        KeyPair.fromJSON(holderFreightForwarder.authKey),
        holderFreightForwarderVerificationMethod,
        false);

    console.log("--------------------------------------------------------");
    console.log("----------------- Cargo VM -----------------------------");
    console.log("--------------------------------------------------------");
    let holderCargo = await identity.getWeakholdObject('./weakhold/Cargo.json');
    let holderCargoVerificationMethod = "CargoPresentation";

    await identity.addVerificationMethod(
        holderCargo.subject,
        holderCargo.did,
        KeyPair.fromJSON(holderCargo.authKey),
        holderCargoVerificationMethod,
        false);

    console.log("--------------------------------------------------------");
    console.log("----------------- Author VM ----------------------------");
    console.log("--------------------------------------------------------");
    let holderAuthor = await identity.getWeakholdObject('./weakhold/Author.json');
    let holderAuthorVerificationMethod = "AuthorPresentation";

    await identity.addVerificationMethod(
        holderAuthor.subject,
        holderAuthor.did,
        KeyPair.fromJSON(holderAuthor.authKey),
        holderAuthorVerificationMethod,
        false);
}

main();