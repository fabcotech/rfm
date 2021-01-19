import { put, takeEvery } from 'redux-saga/effects';
import * as rchainToolkit from 'rchain-toolkit';
import { deflate } from 'pako';
import { v4 } from 'uuid';

import { Document, store, State, getBagsData, Signature } from '../';
import replacer from '../../utils/replacer';
import generateSignature from '../../utils/generateSignature';
import { addressFromBagId } from 'src/utils/addressFromBagId';

const { purchaseTokensTerm } = require('rchain-token-files');

const reuploadBagData = function*(action: {
  type: string;
  payload: { bagId: string; registryUri: string };
}) {
  console.log('reuploload-bag-data', action.payload);
  const state: State = store.getState();
  const bagsData = getBagsData(state);

  const publicKey = state.publicKey;

  const document =
    bagsData[`${action.payload.registryUri}/${action.payload.bagId}`];
  if (!document) {
    console.error('bagData/document not found');
    return;
  }

  const signedDocument = {
    ...document,
    data: Buffer.from(document.data, 'utf-8').toString('base64'),
    date: document.date,
    parent: addressFromBagId(action.payload.registryUri, action.payload.bagId),
  };
  const signature: Signature = {
    publicKey: publicKey as string,
    signature: generateSignature(signedDocument, state.privateKey as string),
  };
  let i = '0';
  let newBagId = action.payload.bagId;
  if (!document.signatures['0']) {
    document.signatures['0'] = signature;
  } else if (!document.signatures['1']) {
    i = '1';
    newBagId = `${action.payload.bagId} ${parseInt(i, 10) + 1}`;
    document.signatures['1'] = signature;
  } else if (!document.signatures['2']) {
    i = '2';
    newBagId = `${action.payload.bagId.slice(
      0,
      action.payload.bagId.length - 1
    )} ${parseInt(i, 10) + 1}`;
    document.signatures['2'] = signature;
  } else {
    console.error('Signature 0, 1 and 2 are already on document');
    return;
  }
  console.log('newBagId', newBagId);

  const asJson = JSON.stringify(
    {
      mimeType: signedDocument.mimeType,
      name: signedDocument.name,
      data: signedDocument.data,
      signatures: signedDocument.signatures,
      date: signedDocument.date,
      parent: signedDocument.parent,
    } as Document,
    replacer
  );
  const gzipped = Buffer.from(deflate(asJson)).toString('base64');
  const payload = {
    publicKey: publicKey,
    newBagId: newBagId,
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

export const reuploadBagDataSaga = function*() {
  yield takeEvery('REUPLOAD_BAG_DATA', reuploadBagData);
};
