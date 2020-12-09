import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { createSelector } from 'reselect';

import { sagas } from './sagas/';

export interface State {
  readOnlyUrl: string;
  validatorUrl: string;

  // rchain-token contract
  nonce: undefined | string;
  identities: { [pubKey: string]: string }; //Map of identities <pubkey, regUri>
  registryUri: undefined | string;

  publicKey: undefined | string;
  privateKey: undefined | string;

  // rchain-token bags and data
  bags: { [bagId: string]: Bag };
  bagsData: { [bagAddr: string]: Document };

  isLoading: boolean;
  searchText: string;
  platform: string;
}

export interface Bag {
  n: string;
  quantity: number;
  price: undefined | number;
  publicKey: string;
}
export interface Signature {
  publicKey: string;
  signature: string;
}
export interface Document {
  name: string;
  mimeType: string;
  data: string;
  signatures: { [s: string]: Signature };
}

const initialState: State = {
  readOnlyUrl: 'http://127.0.0.1:40403',
  validatorUrl: 'http://127.0.0.1:40403',
  nonce: undefined,
  identities: {},
  registryUri: undefined,
  privateKey: undefined,
  publicKey: undefined,
  bags: {},
  bagsData: {},
  isLoading: false,
  searchText: '',
  platform: '',
};

const reducer = (
  state = initialState,
  action: { type: string; payload: any }
): State => {
  console.log(action);
  switch (action.type) {
    case 'INIT': {
      return {
        ...state,
        registryUri: action.payload.registryUri,
        publicKey: action.payload.publicKey,
        privateKey: action.payload.privateKey,
      };
    }
<<<<<<< HEAD
    case 'INIT_COMPLETED': {
=======
    case "ADD_IDENTITY": {
      return {
        ...state,
        identities: {
          ...state.identities,
          [action.payload.pubKey]: action.payload.registryUri
        }
      };
    }
    case "INIT_COMPLETED": {
>>>>>>> Identity mockups, not working yet
      return {
        ...state,
        nonce: action.payload.nonce,
      };
    }
    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case 'SAVE_BAGS_COMPLETED': {
      return {
        ...state,
        bags: action.payload,
      };
    }
    case 'SAVE_BAG_DATA_COMPLETED': {
      return {
        ...state,
        bagsData: {
          ...state.bagsData,
          [action.payload.registryUri + '/' + action.payload.bagId]: action
            .payload.document,
        },
      };
    }
    case 'SET_PLATFORM': {
      return {
        ...state,
        platform: action.payload.platform,
      };
    }
    case 'SET_SEARCH_TEXT': {
      return {
        ...state,
        searchText: action.payload.searchText,
      };
    }
    case 'UPLOAD_BAG_DATA_COMPLETED': {
      return {
        ...state,
        nonce: action.payload.nonce,
      };
    }
    default: {
      return state;
    }
  }
};

const sagaMiddleware = createSagaMiddleware();
let middlewares = [sagaMiddleware];

const sagasFunction = function* rootSaga() {
  try {
    yield all([sagas()]);
  } catch (err) {
    console.error('An error occured in sagas');
    console.log(err);
  }
};

export const store = createStore(reducer, applyMiddleware(...middlewares));

sagaMiddleware.run(sagasFunction);

export const getPrivateKey = createSelector(
  (state: State) => state,
  (state: State) => state.privateKey
);
export const getPublicKey = createSelector(
  (state: State) => state,
  (state: State) => state.publicKey
);
export const getBags = createSelector(
  (state: State) => state,
  (state: State) => state.bags
);
export const getBagsData = createSelector(
  (state: State) => state,
  (state: State) => state.bagsData
);

export const getDocumentsAwaitingSignature = createSelector(
  getBagsData,
  getPublicKey,
  (bagsData: State['bagsData'], publicKey: State['publicKey']) => {
    const documentsAwaitingSignature: { [bagId: string]: Document } = {};
    Object.keys(bagsData).forEach(bagId => {
      const document = bagsData[bagId];
      if (
        document.signatures['0'] &&
        !document.signatures['1'] &&
        document.signatures['0'].publicKey !== publicKey
      ) {
        documentsAwaitingSignature[bagId] = document;
        return;
      }

      if (
        document.signatures['0'] &&
        document.signatures['1'] &&
        !document.signatures['2'] &&
        document.signatures['1'].publicKey !== publicKey
      ) {
        documentsAwaitingSignature[bagId] = document;
        return;
      }
    });

    return documentsAwaitingSignature;
  }
);
