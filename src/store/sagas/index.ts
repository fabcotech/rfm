import { all } from 'redux-saga/effects';

import { retrieveSaga } from './retrieve';

export const sagas = function* rootSaga() {
  yield all([
    retrieveSaga(),
  ])
};
