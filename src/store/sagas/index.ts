import { all } from 'redux-saga/effects';

import { loadSaga } from './load';
import { loadBagDataSaga } from './loadBagData';
import { uploadBagDataSaga } from './uploadBagData';
import { reuploadBagDataSaga } from './reuploadBagData';

export const sagas = function* rootSaga() {
  yield all([
    loadSaga(),
    loadBagDataSaga(),
    uploadBagDataSaga(),
    reuploadBagDataSaga()
  ])
};
