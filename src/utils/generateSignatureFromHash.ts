import * as rchainToolkit from "rchain-toolkit";

export default (uint8array: Uint8Array, privateKey: string) => {
  const signature = rchainToolkit.utils.signSecp256k1(uint8array, privateKey);
  const signatureHex = Buffer.from(signature).toString("hex");

  return signatureHex;
};
