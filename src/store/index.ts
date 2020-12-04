import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from 'redux-saga/effects';

import { sagas } from './sagas/';

export interface State {
  readOnlyUrl: string;
  validatorUrl: string;

  // rchain-token contract
  nonce: undefined | string;
  registryUri: undefined | string;

  privateKey: undefined | string;

  // rchain-token bags and data
  bags: { [id: string]: Bag };
  bagsData: { [id: string]: File };

  isLoading: boolean;
}

export interface Bag {
  n: string;
  quantity: number;
  price: undefined | number;
  publicKey: string;
}
export interface Document {
  name: string;
  mimeType: string;
  data: string;
}

const initialState: State = {
  readOnlyUrl: 'http://localhost:40403',
  validatorUrl: 'http://localhost:40403',
  nonce: undefined,
  registryUri: undefined,
  privateKey: undefined,
  bags: {},
  bagsData: {},
  isLoading: false
};

const reducer = (state = initialState, action: { type: string; payload: any }) => {
  console.log(action);
  switch (action.type) {
    case "INIT": {
      return {
        ...state,
        registryUri: action.payload.registryUri,
        privateKey: action.payload.privateKey,
      };
    }
    case "INIT_COMPLETED": {
      return {
        ...state,
        nonce: action.payload.nonce,
      };
    }
    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case "SET_LOADING_BAG": {
      return {
        ...state,
        isLoadingBag: action.payload,
      };
    }
    case "SAVE_BAGS_COMPLETED": {
      return {
        ...state,
        bags: action.payload,
      };
    }
    case "SAVE_BAGS_DATA_COMPLETED": {
      return {
        ...state,
        bagData:{
            ...state.bagsData,
            [action.payload.bagId]: action.payload.document,
        },
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
}

export const store = createStore(reducer, applyMiddleware(...middlewares));

sagaMiddleware.run(sagasFunction);