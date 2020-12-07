import { put, takeEvery } from 'redux-saga/effects';
import * as rchainToolkit from 'rchain-toolkit';
import { deflate } from 'pako';
import { v4 } from "uuid";

import generateSignature from '../../utils/generateSignature';
import { Document, store, State } from '../../store/';

const {
  createTokensTerm,
} = require('rchain-token-files');

const uploadBagData = function* (action: { type: string; payload: { document: Document; bagId: string}}) {
  console.log('uploload-bag-data', action.payload);
  const document = action.payload.document;
  const state: State = store.getState();

const publicKey = rchainToolkit.utils.publicKeyFromPrivateKey(state.privateKey as string);

  const base64 = Buffer.from(document.data).toString("base64");
  const asJson = JSON.stringify({
    mimeType: document.mimeType,
    name: document.name,
    data: base64,
    signatures: [],
  });
  const gzipped = Buffer.from(deflate(asJson)).toString("base64");
  const newNonce = v4().replace(/-/g, "");
  const payload = {
    bags: {
      [`${action.payload.bagId}`]: {
        nonce: v4().replace(/-/g, ""),
        publicKey: publicKey,
        n: '0',
        price: null,
        quantity: 1,
      }
    },
    data: {
      [`${action.payload.bagId}`]: gzipped
    },
    nonce: state.nonce,
    newNonce: newNonce,
  }

  console.log(payload);
  const ba = rchainToolkit.utils.toByteArray(payload);
  console.log(ba)
  console.log(state.privateKey);
  const signature = generateSignature(ba, state.privateKey as string);

  const term = createTokensTerm(
    state.registryUri as string,
    payload,
    signature,
  );

  let validAfterBlockNumberResponse;
  try {
    validAfterBlockNumberResponse = JSON.parse(
      yield rchainToolkit.http.blocks(state.readOnlyUrl, {
        position: 1,
      })
    )[0].blockNumber;
  } catch (err) {
    console.log(err);
    throw new Error("Unable to get last finalized block")
  }

  const timestamp = new Date().getTime();
  const deployOptions = yield rchainToolkit.utils.getDeployOptions(
    "secp256k1",
    timestamp,
    term,
    state.privateKey as string,
    publicKey,
    1,
    1000000,
    validAfterBlockNumberResponse
  );
  yield rchainToolkit.http.deploy(
    state.validatorUrl,
    deployOptions
  )

  yield put(
    {
      type: "UPLOAD_BAG_DATA_COMPLETED",
      payload: {
        nonce: newNonce,
      }
    }
  );

  return true;
};

export const uploadBagDataSaga = function* () {
  yield takeEvery("UPLOAD", uploadBagData);
};
