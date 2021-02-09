import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import { Provider } from "react-redux";

import { store, history } from "./store/";
import { ConnectedRouter } from 'connected-react-router'

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Root />
    </ConnectedRouter>
  </Provider>
  , document.getElementById('root')
);
