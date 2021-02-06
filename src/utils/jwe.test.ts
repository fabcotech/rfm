import KeyResolver from 'key-did-resolver';
import { getResolver as getRchainResolver } from "rchain-did-resolver";
import { DID } from 'dids'

import { toBuffer, bufferToHex } from "ethereumjs-util";
import hdkey from "ethereumjs-wallet/dist/hdkey";

import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Secp256k1Provider } from 'key-did-provider-secp256k1'



const fromSeed = mnemonicToSeedSync(generateMnemonic());
const hdWallet = hdkey.fromMasterSeed(fromSeed);

// generate key pair in path m/44'/60'/0'/0/0
const key = hdWallet.derivePath("m/44'/60'/0'/0/" + 0);

//@ts-ignore-next-line
const privateKey = bufferToHex(key._hdkey._privateKey);
const authSecret = toBuffer(privateKey)
const provider = new Secp256k1Provider(authSecret)
const did = new DID({ provider: provider, resolver: { ...getRchainResolver, ...KeyResolver.getResolver() } })


test('should sign, encrypt, decrypt and verify', async () => {
    await did.authenticate()

    // create JWS
    const { jws, linkedBlock } = await did.createDagJWS({ hello: 'world' })
    console.info("SIGNED: " + JSON.stringify(jws));
    const verified = await did.verifyJWS(jws);
    console.info("VERIFIED: " + JSON.stringify(verified));

    const myid = await did.resolve(did.id);
    console.info("MYID: " + JSON.stringify(myid));

    //TODO: Fix jest error
    /* digest should be a Uint8Array

      at Object.encode (node_modules/multihashes/src/index.js:133:11)
      at Multihashing (node_modules/multihashing-async/src/index.js:17:20)
      at Object.<anonymous>.exports.cid (node_modules/ipld-dag-cbor/src/util.js:180:21) */


    // create JWE
    const initial = { very: 'secret' }
    const jwe2 = await did.createDagJWE(initial, [did.id], {
      protectedHeader: {
        alg: "A256GCMKW"
      }
    })
    console.info("JWE: " + JSON.stringify(jwe2));

    // decrypt JWE
    const decrypted = await did.decryptDagJWE(jwe2)
    console.info("DECRYPTED");
    console.info(decrypted);

    expect(decrypted).toHaveProperty('very', initial.very)
});
