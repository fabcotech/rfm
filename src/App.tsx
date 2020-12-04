import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import React  from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRouterOutlet,
} from '@ionic/react';
import './App.css';
import { Bag, State } from './store';

import DockListView from './views/DocListView';
import LoginView from './views/LoginView';

interface AppProps {
  isLoading: boolean;
  registryUri: undefined | string;
  bags: { [id: string]: Bag }
  init: (a: { registryUri: string, privateKey: string }) => void;
}
const AppComponent: React.FC<AppProps> = (props) => {

  if (!props.registryUri) {
    return (
      <LoginView />
    )
  }

  return (
    <Router>
      <IonPage id="home-page">
        <IonHeader>
          <IonToolbar>
            <IonTitle>RFM</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>

          <IonRouterOutlet id="main">
            <Route path="/doc/:uri?" render={(props) => (
              <DockListView {...props}/>
            )} />
            <Route path="/" render={({ location }) => 
              <Redirect to={{
                pathname: '/doc',
                state: { from: location },
              }} />} exact />
          </IonRouterOutlet>
        
        </IonContent>
      </IonPage>
    </Router>
  );
};

export const App = connect((state: State) => {
  return {
    registryUri: state.registryUri,
    bags: state.bags,
    isLoading: state.isLoading,
  }
}, (dispatch: Dispatch) => {
  return {
    init: (a: { registryUri: string, privateKey: string }) => {
      dispatch({
        type: 'INIT',
        payload: {
          privateKey: a.privateKey,
          registryUri: a.registryUri,
        }
      })
    }
  }
})(AppComponent);

export default App;
