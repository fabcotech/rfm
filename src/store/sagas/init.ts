import { takeEvery, put } from 'redux-saga/effects';
import * as rchainToolkit from 'rchain-toolkit';

import { store, State, Bag } from '..';
import { addressFromBagId } from '../../utils/addressFromBagId';
import { inflate } from 'pako';

const {
  readBagsTerm,
  readBagsOrTokensDataTerm,
  read,
} = require('rchain-token-files');

const load = function* (action: { type: string; payload: any}) {
  const state: State = store.getState();
  yield put(
    {
      type: "SET_LOADING",
      payload: true
    }
  );

  const term1 = readBagsTerm(action.payload.registryUri);
  const ed1 = yield rchainToolkit.http.exploreDeploy(
    state.readOnlyUrl,
    {
      term: term1
    }
  )

  const term2 = read(action.payload.registryUri);
  const ed2 = yield rchainToolkit.http.exploreDeploy(
    state.readOnlyUrl,
    {
      term: term2
    }
  )

  const term3 = readBagsOrTokensDataTerm(action.payload.registryUri, 'bags');
  const ed3 = yield rchainToolkit.http.exploreDeploy(
    state.readOnlyUrl,
    {
      term: term3
    }
  )

  const rchainTokenValues = rchainToolkit.utils.rhoValToJs(JSON.parse(ed2).expr[0])
  yield put(
    {
      type: "INIT_COMPLETED",
      payload: {
        nonce: rchainTokenValues.nonce,
        contractPublicKey: rchainTokenValues.publicKey,
      }
    }
  );

  const bags = rchainToolkit.utils.rhoValToJs(JSON.parse(ed1).expr[0]);
  const newBags: { [address: string]: Bag } = {};
  Object.keys(bags).forEach(bagId => {
    newBags[addressFromBagId(state.registryUri as string, bagId)] = bags[bagId];
  });
  yield put(
    {
      type: "SAVE_BAGS_COMPLETED",
      payload: newBags,
    }
  );

  const bagsData = rchainToolkit.utils.rhoValToJs(JSON.parse(ed3).expr[0]);
  const newBagsData: { [address: string]: Document } = {};

  Object.keys(bagsData).forEach(bagId => {
    const dataAtNameBuffer = Buffer.from(decodeURI(bagsData[bagId]), 'base64');
    const unzippedBuffer = Buffer.from(inflate(dataAtNameBuffer));
    const fileAsString = unzippedBuffer.toString("utf-8");
    const fileAsJson = JSON.parse(fileAsString);

    fileAsJson.data = Buffer.from(fileAsJson.data, 'base64').toString("utf-8");
    newBagsData[addressFromBagId(state.registryUri as string, bagId)] = fileAsJson;
  });

  yield put(
    {
      type: "SAVE_BAGS_DATA_COMPLETED",
      payload: newBagsData
    }
  );

  yield put(
    {
      type: "SET_LOADING",
      payload: false
    }
  );

  return true;
};

export const initSaga = function* () {
  yield takeEvery("INIT", load);
};
