import { takeEvery, put } from 'redux-saga/effects';
import * as rchainToolkit from 'rchain-toolkit';

import { store, State } from '../../store/';

const {
  readBagsTerm,
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

  const rchainTokenValues = rchainToolkit.utils.rhoValToJs(JSON.parse(ed2).expr[0])
  yield put(
    {
      type: "INIT_COMPLETED",
      payload: {
        nonce: rchainTokenValues.nonce,
      }
    }
  );
  yield put(
    {
      type: "SAVE_BAGS_COMPLETED",
      payload: rchainToolkit.utils.rhoValToJs(JSON.parse(ed1).expr[0])
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

export const loadSaga = function* () {
  yield takeEvery("INIT", load);
};
