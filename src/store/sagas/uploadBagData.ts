import { put, takeEvery } from 'redux-saga/effects';
import * as rchainToolkit from 'rchain-toolkit';
import { deflate } from 'pako';
import { v4 } from 'uuid';

import { Document, store, State } from '../';

import replacer from '../../utils/replacer';

const { purchaseTokensTerm } = require('rchain-token-files');

const uploadBagData = function*(action: {
  type: string;
  payload: { document: Document; bagId: string };
}) {
  console.log('uploload-bag-data', action.payload);
  const document = action.payload.document;
  const state: State = store.getState();

  const publicKey = state.publicKey;

  const asJson = JSON.stringify(
    {
      mimeType: document.mimeType,
      name: document.name,
      data: document.data,
      signatures: document.signatures,
    } as Document,
    replacer
  );
  const gzipped = Buffer.from(deflate(asJson)).toString('base64');
  const payload = {
    publicKey: publicKey,
    newBagId: action.payload.bagId,
    bagId: '0',
    quantity: 1,
    price: 1,
    bagNonce: v4().replace(/-/g, ''),
    data: gzipped,
  };

  const term = purchaseTokensTerm(state.registryUri as string, payload);

  let validAfterBlockNumberResponse;
  try {
    validAfterBlockNumberResponse = JSON.parse(
      yield rchainToolkit.http.blocks(state.readOnlyUrl, {
        position: 1,
      })
    )[0].blockNumber;
  } catch (err) {
    console.log(err);
    throw new Error('Unable to get last finalized block');
  }

  const timestamp = new Date().getTime();
  const deployOptions = yield rchainToolkit.utils.getDeployOptions(
    'secp256k1',
    timestamp,
    term,
    state.privateKey as string,
    publicKey as string,
    1,
    4000000000,
    validAfterBlockNumberResponse
  );
  yield rchainToolkit.http.deploy(state.validatorUrl, deployOptions);

  yield put({
    type: 'PURCHASE_BAG_COMPLETED',
    payload: {},
  });

  return true;
};

export const uploadBagDataSaga = function*() {
  yield takeEvery('UPLOAD', uploadBagData);
};
