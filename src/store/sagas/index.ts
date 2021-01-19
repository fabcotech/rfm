import { all } from 'redux-saga/effects';

import { initSaga } from './init';
import { loadBagDataSaga } from './loadBagData';
import { uploadBagDataSaga } from './uploadBagData';
import { reuploadBagDataSaga } from './reuploadBagData';

export const sagas = function* rootSaga() {
  yield all([
    initSaga(),
    loadBagDataSaga(),
    uploadBagDataSaga(),
    reuploadBagDataSaga()
  ])
};
