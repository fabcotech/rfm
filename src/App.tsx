import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import React, { Suspense, useEffect }  from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRouterOutlet,
  IonLoading
} from '@ionic/react';
import './App.css';
import { Bag, State } from './store';

import { Plugins } from "@capacitor/core";
const { Device } = Plugins;

const LoginView = React.lazy(() => import('./views/LoginView'));
const DockListView = React.lazy(() => import('./views/DocListView'));

interface AppProps {
  isLoading: boolean;
  registryUri: undefined | string;
  bags: { [id: string]: Bag }
  init: (a: { registryUri: string, privateKey: string }) => void;
  setPlatform: (platform: string) => void;
}
const AppComponent: React.FC<AppProps> = (props) => {

  useEffect(() => {
    Device.getInfo().then(info => {
      console.log(info);
      props.setPlatform(info.platform);
    });
  }, []);

  if (!props.registryUri) {
    return (
      <Suspense fallback={<IonLoading isOpen={true}></IonLoading>}>
        <LoginView />
      </Suspense>
    )
  }

  return (
    <Router>
      <IonPage id="home-page">
        <IonHeader no-border>
          <IonToolbar color="primary" class="noSafeAreaPaddingTop">
            <IonTitle>RFM</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>

          <IonRouterOutlet id="main">
            <Route exact path="/doc/show/:bagId?" render={(props) => (
              <Suspense fallback={<IonLoading isOpen={true}></IonLoading>}>
                <DockListView bagId={props.match.params.bagId} action="show" />
              </Suspense>
            )} />
            <Route exact path="/doc/" render={(props) => (
              <Suspense fallback={<IonLoading isOpen={true}></IonLoading>}>
                <DockListView action="list" />
              </Suspense>
            )} />
            <Route exact path="/doc/upload" render={(props) => (
              <Suspense fallback={<IonLoading isOpen={true}></IonLoading>}>
                <DockListView action="upload" />
              </Suspense>
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
    },
    setPlatform: (platform: string) => {
      dispatch({
        type: 'SET_PLATFORM',
        payload: {
          platform: platform
        }
      })
    }
  }
})(AppComponent);

export default App;
