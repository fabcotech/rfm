import * as rchainToolkit from 'rchain-toolkit';

const { blake2b } = require("blakejs");

export default (nonce: Uint8Array, privateKey: string) => {
  const bufferToSign = Buffer.from(nonce);
  const uInt8Array = new Uint8Array(bufferToSign);
  const blake2bHash = blake2b(uInt8Array, 0, 32);
  const signature = rchainToolkit.utils.signSecp256k1(blake2bHash, privateKey);
  const signatureHex = Buffer.from(signature).toString("hex");

  return signatureHex;
}