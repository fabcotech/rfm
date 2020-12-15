import * as elliptic from 'elliptic';

import { Document } from '../store';

import generateHashFromDocument from './generateHashFromDocument';

const ec = new elliptic.ec('secp256k1');

export default (document: Document, s: string): boolean => {
  let hash: undefined | Uint8Array;
  let signature: undefined | string;
  let publicKey: undefined | string;
  const documentWithoutSignature: Document = {
    data: document.data,
    mimeType: document.mimeType,
    name: document.name,
    signatures: {},
  };
  if (s === '0') {
    signature = document.signatures['0'].signature;
    publicKey = document.signatures['0'].publicKey;
    hash = generateHashFromDocument(documentWithoutSignature);
  }
  if (s === '1') {
    documentWithoutSignature.signatures = { '0': document.signatures['0'] }
    signature = document.signatures['1'].signature;
    publicKey = document.signatures['1'].publicKey;
    hash = generateHashFromDocument(documentWithoutSignature);
  }
  if (s === '2') {
    documentWithoutSignature.signatures = {
      '0': document.signatures['0'],
      '1': document.signatures['1'],
    }
    signature = document.signatures['2'].signature;
    publicKey = document.signatures['2'].publicKey;
    hash = generateHashFromDocument(documentWithoutSignature);
  }

  if (!publicKey || !signature || !hash) {
    return false;
  }

  let verified = false;
  try {
    verified = ec.verify(
      Buffer.from(hash).toString('hex'),
      Buffer.from(signature, 'hex'),
      Buffer.from(publicKey, 'hex'),
      'hex'
    );
  } catch (err) {
    console.log(err);
    return false;
  }

  if (verified) {
    return true;
  }

  return false;
};
