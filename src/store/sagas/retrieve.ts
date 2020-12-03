import { takeEvery, put } from 'redux-saga/effects';
import * as rchainToolkit from 'rchain-toolkit';

const {
  readBagsTerm,
} = require('rchain-token-files');

const retrieve = function* (action: { type: string; payload: any}) {
  console.log('retrieve', action.payload);

  const term = readBagsTerm(action.payload.registryUri);
  const ed = yield rchainToolkit.http.exploreDeploy(
    "https://observer.testnet.rchain.coop",
    {
      term: term
    }
  )
  console.log(ed);
  console.log(rchainToolkit.utils.rhoValToJs(JSON.parse(ed).expr[0]));
  yield put(
    {
      type: "SAVE_BAGS",
      payload: rchainToolkit.utils.rhoValToJs(JSON.parse(ed).expr[0])
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

export const retrieveSaga = function* () {
  yield takeEvery("INIT", retrieve);
};
