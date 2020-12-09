import * as rchainToolkit from 'rchain-toolkit';

import generateHashFromDocument from './generateHashFromDocument';
import { Document } from '../store';

export default (document: Document, privateKey: string) => {
  const blake2bHash = generateHashFromDocument(document);
  const signature = rchainToolkit.utils.signSecp256k1(blake2bHash, privateKey);
  const signatureHex = Buffer.from(signature).toString('hex');

  return signatureHex;
};
