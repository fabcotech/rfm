import { createStore, Action, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from 'redux-saga/effects';
import { sagas } from './store/sagas/';

export interface State {
  registryUri: undefined | string;
  privateKey: undefined | string;
  bags: { [id: string]: Bag }
}

export interface Bag {
  n: string;
  quantity: number;
  price: undefined | number;
  publicKey: string;
}
const initialState: State = {
  registryUri: undefined,
  privateKey: undefined,
  bags: {}
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
    case "SAVE_BAGS": {
      return {
        ...state,
        bags: action.payload,
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