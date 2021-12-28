## IOTA Identity Tutorial (WASM-Binding)

### Problem Description
In this tutorial you will utilize the [WASM binding of the IOTA Identity framework](https://github.com/iotaledger/identity.rs/tree/dev/bindings/wasm/examples) to solve the problem described below. To follow along please clone this repo and make sure to install the npm/yarn package *@iota/identity-wasm@dev* as described [here](https://github.com/iotaledger/identity.rs/blob/dev/bindings/wasm/README.md#install-the-library):
> Alice recently graduated from the University of Oslo with a Bachelor of Computer Science. Now she wants to apply for a remote job at the IOTA Foundation and needs to digitally prove the existence and validity of her degree. What she needs is an immutable and verifiable credential, which has been approved by both the University of Oslo and herself, before presenting it to her possible new employer.

### Roles
As described [here](https://www.iota.org/solutions/digital-identity), IOTA Identity builds on the W3C's proposed standards for a digital identity framework and thus is based on three roles:
- Holder (Alice)
- Issuer (University of Oslo)
- Verifier (IOTA Foundation)

### Terms
|Term   | Definition    |
|:---   |:---           |
| [Decentralized Identifier (DID)](https://www.w3.org/TR/did-core/#dfn-decentralized-identifiers) |A globally unique persistent identifier that does not require a centralized registration authority and is often generated and/or registered cryptographically.|
| [DID Subject](https://www.w3.org/TR/did-core/#dfn-did-subjects)          |The entity identified by a DID and described by a DID document. Anything can be a DID subject: person, group, organization, physical thing, digital thing, logical thing, etc.  |
| [DID Document](https://www.w3.org/TR/did-core/#dfn-did-documents)          |A set of data describing the DID subject, including mechanisms, such as cryptographic public keys, that the DID subject or a DID delegate can use to authenticate itself and prove its association with the DID  |
| [Verification Method](https://www.w3.org/TR/did-core/#dfn-verification-method)   |A set of parameters that can be used together with a process to independently verify a proof. For example, a cryptographic public key can be used as a verification method with respect to a digital signature; in such usage, it verifies that the signer possessed the associated cryptographic private key. |
| [Verifiable Credential](https://www.w3.org/TR/did-core/#dfn-verifiable-credentials) | A standard data model and representation format for cryptographically-verifiable digital credentials. It is signed by the issuer, to prove control over the Verifiable Credential with a nonce or timestamp. |
| Verifiable Presentation | A Verifiable Presentation is the format in which a (collection of) Verifiable Credential(s) gets shared. It is signed by the subject, to prove control over the Verifiable Credential with a nonce or timestamp. |
| [DID Resolution](https://www.w3.org/TR/did-core/#dfn-did-resolution)  | The process that takes as its input a DID and a set of resolution options and returns a DID document in a conforming representation plus additional metadata.  |
| [Merkle Key Collection](https://medium.com/asecuritysite-when-bob-met-alice/how-can-i-have-a-1-000-private-keys-but-just-one-public-key-well-thats-merkle-magic-6c323439417b)  | By using a Merkle Tree you can verify the ownership of multiple private keys (Must be a power of 2) with only one public key.  |

### Flow-Chart
![banner](./Identity_Tutorial_Chart.png)

### Key Storage
- In this tutorial, the key pairs for every newly created or updated DID document will be stored in Weakhold
    - Ok, ok, it's just a couple of JSON files in a folder, but it get's the job done
    - The files are stored in the Folder *weakhold* (e.g. ./weakhold/Alice.json)

:warning: **Needless to say that this is no proper key storage solution and for professional IOTA implementations we strongly recommend using our key management framework [Stronghold](https://github.com/iotaledger/stronghold.rs).**

Example Weakhold file:
```json
{
    "subject": "Alice",
    "did": "did:iota:Bakoe4HD4uwekMuyMkeo7mCsA2frXej68M4QyFvEpo2G",
    "messageId": "7c25309fe97f2cf2d609cf83f31e8838795dd16d235c7a56566970309a0d6dbd",
    "explorerUrl": "https://explorer.iota.org/mainnet/message/7c25309fe97f2cf2d609cf83f31e8838795dd16d235c7a56566970309a0d6dbd",
    "authKey": {
        "type": "ed25519",
        "public": "ExwZKmF9y2N4mKnEaeUU7bFyCkZ5oVjjK3ojooJKNxUK",
        "secret": "G83815cmpPadAzs52GmpwS614xpaAWWQxUexmRVNkg75"
    },
    "verifKey": {
        "type": "ed25519",
        "public": "F9aM5Q9gGXb6Dswe8eSdsz5eDQX2ErTnpGDjFj5LMVvx",
        "secret": "12S3U2u8ofyju53tmGsG9PKQfkBM8rhzL9BUBhfGqpdm"
    }
}
```

### Steps
In this process, you will complete the different steps from the perspective of one of the mentioned roles above:

1. **Holder:** Create a DID (Decentralized Identifier) document for Alice. After this step you will find Alice's weakhold file in [./weakhold/Alice.json](./weakhold/Alice.json).
    - [createDid.js](createDid.js)
    ```javascript
    createDid('Alice');
    ```

2. **Issuer:** Create a DID document for the University of Oslo. After this step you will find University of Oslo's weakhold file in [./weakhold/UniversityofOslo.json](./weakhold/UniversityofOslo.json).
    - [createDid.js](createDid.js)
    ```javascript
    createDid('University of Oslo');
    ```

3. **Issuer:** Add a verification method "degreeVerifications" to the University's DID document with the purpose to verify Alice's degree. Since it's expected, that the University will have to sign more than just Alice's degree, this verification method is generated with a set of Merkle keys. These signatures can all be proved by a single public key, while retaining the ability to revoke them separately. Note that the newly added verification method is of the *type* "MerkleKeyCollection".
    - [addVerificationMethod.js](addVerificationMethod.js)
    ```javascript
    //Add verification method with collection of merkle keys to issuer DID
    //This enables the issuer to sign and revoke multiple documents without having to remove the verification method for each revocation
    let issuer = getWeakholdObject('./weakhold/UniversityofOslo.json')
    let issuerVerificationMethod = "degreeVerifications";

    addVerificationMethod(
        subjectName = issuer.subject,
        did = issuer.did,
        authKey = KeyPair.fromJSON(issuer.authKey),
        verificationMethodName = issuerVerificationMethod,
        merkleKeys = true);
    ```

4. **Holder:** Add a verification method to Alice's DID document with the purpose to present her degree to a third party. Since Alice only needs one key pair to the verifiable presentation of her credential, this verification method is generated with a simple private/public key pair. Note that the newly added verification method is of the *type* "Ed25519VerificationKey".
    - [addVerificationMethod.js](addVerificationMethod.js)
    ```javascript
    //Add verification method to holder DID
    let holder = getWeakholdObject('./weakhold/Alice.json')
    let holderVerificationMethod = "aliceDegreePresentation";

    addVerificationMethod(
        subjectName = holder.subject,
        did = holder.did,
        authKey = KeyPair.fromJSON(holder.authKey),
        verificationMethodName = holderVerificationMethod,
        merkleKeys = false);
    ```

5. **Holder:** Setup a document representing Alice's degree, containing her DID.
    - [createVerifiableCredential.js](createVerifiableCredential.js)
    ```javascript
    //This part is already hard coded in "createVerifiableCredential.js"
    //Create credential indicating the degree earned by Alice
    const credentialSubject = {
        "id": holderDid,
        "name": holderSubject,
        "degreeName": "Bachelor of Computer Science",
        "degreeType": "BachelorDegree",
        "GPA": "4.0"
    }
    ```

6. **Issuer:** Sign degree document with the first key in the Merkle key collection of the University's verification method in order to get a verifiable credential. After this step you will find the verifiable credential of Alice's degree in [./signedCredentials/offlineVerifiableCredential.json](./signedCredentials/offlineVerifiableCredential.json).
    - [createVerifiableCredential.js](createVerifiableCredential.js)
    ```javascript
    //Issue and sign verifiable credential from weakhold object
    let issuer = getWeakholdObject('./weakhold/UniversityofOslo.json')
    let issuerVerificationMethod = "degreeVerifications";
    let holder = getWeakholdObject('./weakhold/Alice.json')

    createVerifiableCredential(
        issuer.subject,
        issuer.did,
        KeyCollection.fromJSON(issuer.verifKey),
        issuerVerificationMethod,
        holder.did,
        holder.subject);
    ```

7. **Holder:** Alice verifies the credentials to make sure it was actually signed by a key associated to the University DID
    - [checkVerifiableCredential.js](checkVerifiableCredential.js)
    ```javascript
    let signedVcPath = './signedCredentials/offlineVerifiableCredential.json';
    checkVerifiableCredential(signedVcPath);
    ```

8. **Holder:** Alice signs verifiable credential with private key of Alices's verification method in order to get a verifiable presentation. After this step you will find the verifiable presentation of Alice's degree in [./signedCredentials/offlineVerifiablePresentation.json](./signedCredentials/offlineVerifiablePresentation.json).
    - [createVerifiablePresentation.js](createVerifiablePresentation.js)
    ```javascript
    //Issue and sign verifiable credential from weakhold object
    let holder = getWeakholdObject('./weakhold/Alice.json')
    let holderVerificationMethod = "aliceDegreePresentation";
    let signedVcPath = './signedCredentials/aliceVerifiableCredential.json';

    createVerifiablePresentation(
        holder.subject,
        holder.did,
        KeyPair.fromJSON(holder.verifKey),
        holderVerificationMethod,
        signedVcPath);
    ```

9. **Verifier:** The IOTA Foundation verfies Alice's and the University's signatures with their respective public keys by checking the verifiable presentation.
    - [checkVerifiablePresentation.js](checkVerifiablePresentation.js)
    ```javascript
    let signedVpPath = './signedCredentials/offlineVerifiablePresentation.json';
    checkVerifiablePresentation(signedVpPath);
    ```

10. **Issuer:** Unfortunately the University found out, that Alice was cheating on her final exam. Thus the University revokes the verification of Alice's credential. Since we have used a Merkle key collection for the University's verification method, this step can be done two ways. Either removing the whole verification method or only revoking the one Merkle key used for the signature. Below you can find both ways. Note that also Alice could revoke her signature on the verifiable presentation, by removing her verification method.
    - [removeVerificationMethod.js](removeVerificationMethod.js)
    ```javascript
    //Remove whole verification method and thus also the used key pair for signatures
    let issuer = getWeakholdObject('./weakhold/UniversityofOslo.json');
    let verificationMethodName  = "degreeVerifications";

    removeVerificationMethod(
        issuer.subject,
        issuer.did,
        KeyPair.fromJSON(issuer.authKey),
        verificationMethodName );
    ```
    - [removeMerkleKey.js](removeMerkleKey.js)
    ```javascript
    //Revoke signatures, which used the first key in the Merkle key collection
    let issuer = getWeakholdObject('./weakhold/UniversityofOslo.json');
    let verificationMethodName  = "degreeVerifications";

    removeMerkleKey(
        issuer.subject,
        issuer.did,
        KeyPair.fromJSON(issuer.authKey),
        verificationMethodName,
        KeyCollection.fromJSON(issuer.verifKey));
    ```

11. **Verifier:** The IOTA Foundation verifies Alice's and the University's signatures again by checking the verifiable presentation and finds out that the University revoked their signature.
    - [checkVerifiablePresentation.js](checkVerifiablePresentation.js)
    ```javascript
    let signedVpPath = './signedCredentials/signedVP.json';
    checkVerifiablePresentation(signedVpPath);
    ```