import { Document } from '../store';

const { blake2b } = require('blakejs');

export default (document: Document): Uint8Array => {
  const signaturesOrdered: [string, string][] = [];
  let ordered: (string | [string, string][])[] = [
    document.name,
    document.mimeType,
    document.data,
    signaturesOrdered,
  ];
  if (document.signatures[0]) {
    signaturesOrdered[0] = [
      document.signatures[0].publicKey,
      document.signatures[0].signature,
    ];
  }
  if (document.signatures[1]) {
    signaturesOrdered[1] = [
      document.signatures[1].publicKey,
      document.signatures[1].signature,
    ];
  }
  if (document.signatures[2]) {
    signaturesOrdered[2] = [
      document.signatures[2].publicKey,
      document.signatures[2].signature,
    ];
  }

  const uInt8Array = new Uint8Array(
    Buffer.from(JSON.stringify({ fields: ordered }))
  );
  return blake2b(uInt8Array, 0, 32);
};
