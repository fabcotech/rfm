import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as rchainToolkit from 'rchain-toolkit';
import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRouterOutlet,
  IonLoading,
  IonButton,
  IonIcon,
  IonSlides,
  IonSlide,
} from '@ionic/react';
import './App.scss';
import './App.scoped.css';
import { Bag, getConnected, State } from './store';

import { Plugins } from '@capacitor/core';

import { ReactComponent as RChainLogo } from './assets/rchain.svg';

import IdentityScreen from './components/identity/IdentityScreen';

import { personCircle, closeCircleOutline, pin } from 'ionicons/icons';

const { Device } = Plugins;

const LoginView = React.lazy(() => import('./views/LoginView'));
const DockListView = React.lazy(() => import('./views/DocListView'));

interface AppProps {
  isLoading: boolean;
  registryUri: undefined | string;
  bags: { [id: string]: Bag };
  init: (a: { registryUri: string; privateKey: string }) => void;
  setPlatform: (platform: string) => void;
}
const AppComponent: React.FC<AppProps> = props => {
  const redfill = React.useRef(null);
  const slider = React.useRef(null);
  const [showIdentity, setShowIdentity] = useState(false);

  const ToggleIdentityView = () => {
    setShowIdentity(!showIdentity);
    console.info(showIdentity);
  };

  useEffect(() => {
    Device.getInfo().then(info => {
      console.log(info);
      props.setPlatform(info.platform);
    });
  }, []);

  const slides = React.useRef(null);

  const slideOpts: Record<string, unknown> = {
    initialSlide: 0,
    speed: 400,
  };

  const onSlideChanged = (event: any) => {
    event.target.getActiveIndex().then((value: any) => {
      console.info(value);
    });
  };

  if (!props.registryUri) {
    return (
      <Router>
        <IonRouterOutlet id="main">
          <Route
            exact
            path="/user"
            render={rprops => (
              <Suspense fallback={<IonLoading isOpen={true} />}>
                <LoginView action="user" key={rprops.location.pathname} />
              </Suspense>
            )}
          />
          <Route
            exact
            path="/user/new"
            render={rprops => (
              <Suspense fallback={<IonLoading isOpen={true} />}>
                <LoginView action="new" key={rprops.location.pathname} />
              </Suspense>
            )}
          />
          <Route
            exact
            path="/user/restore"
            render={rprops => (
              <Suspense fallback={<IonLoading isOpen={true} />}>
                <LoginView action="restore" key={rprops.location.pathname} />
              </Suspense>
            )}
          />
          <Route
            path="*"
            render={rprops => (
              <Suspense fallback={<IonLoading isOpen={true} />}>
                <LoginView action="user" key={rprops.location.pathname} />
              </Suspense>
            )}
          />
        </IonRouterOutlet>
      </Router>
    );
  }

  return (
    <Router>
      <IonPage id="home-page">
        <IonHeader no-border className="ion-no-border RoundedHeader">
          <IonToolbar className="noSafeAreaPaddingTop">
            <IonTitle className="main-title">RChain File Manager</IonTitle>
            <IonButton
              slot="end"
              icon-only
              color="none"
              class="ProfileButton"
              onClick={() => {
                ToggleIdentityView();
              }}
            >
              {showIdentity ? (
                <IonIcon icon={closeCircleOutline} size="large" />
              ) : (
                <IonIcon icon={personCircle} size="large" />
              )}
            </IonButton>
          </IonToolbar>
          <div
            className={showIdentity ? 'RedFill show' : 'RedFill hide'}
            ref={redfill}
          >
            <IonContent class="IdentityBG">
              <div
                className={
                  showIdentity ? 'ProfilePanel show' : 'ProfilePanel hide'
                }
              >
                <div className="ArrowLeft" />
                <div className="ArrowRight" />
                <IonSlides
                  class="IdentityList"
                  options={slideOpts}
                  pager={true}
                  onIonSlideDidChange={onSlideChanged}
                >
                  <IonSlide className="IdentitySlide">
                    <IdentityScreen />
                  </IonSlide>
                  <IonSlide>
                    <IdentityScreen />
                  </IonSlide>
                </IonSlides>
              </div>
            </IonContent>
          </div>
        </IonHeader>
        <IonContent>
          <RChainLogo className="BackgroundLogo" />
          <IonRouterOutlet id="main">
            <Route
              exact
              path="/doc/show/:registryUri/:bagId?"
              render={rprops => (
                <Suspense fallback={<IonLoading isOpen={true} />}>
                  <DockListView
                    registryUri={rprops.match.params.registryUri}
                    bagId={rprops.match.params.bagId}
                    action="show"
                    key={rprops.location.hash}
                  />
                </Suspense>
              )}
            />
            <Route
              exact
              path="/doc/"
              render={rprops => (
                <Suspense fallback={<IonLoading isOpen={true} />}>
                  <DockListView
                    registryUri={props.registryUri as string}
                    action="list"
                    key={rprops.location.hash}
                  />
                </Suspense>
              )}
            />
            <Route
              exact
              path="/doc/upload"
              render={rprops => (
                <Suspense fallback={<IonLoading isOpen={true} />}>
                  <DockListView
                    registryUri={props.registryUri as string}
                    action="upload"
                    key={rprops.location.hash}
                  />
                </Suspense>
              )}
            />
            <Route
              path="/"
              render={({ location }) => (
                <Redirect
                  to={{
                    pathname: '/doc',
                    state: { from: location },
                  }}
                />
              )}
              exact
            />
          </IonRouterOutlet>
        </IonContent>
      </IonPage>
    </Router>
  );
};

export const App = connect(
  (state: State) => {
    return {  
      registryUri: state.registryUri,
      bags: state.bags,
      isLoading: state.isLoading,
    };
  },
  (dispatch: Dispatch) => {
    return {
      init: (a: { registryUri: string; privateKey: string }) => {
        dispatch({
          type: 'INIT',
          payload: {
            privateKey: a.privateKey,
            publicKey: rchainToolkit.utils.publicKeyFromPrivateKey(
              a.privateKey as string
            ),
            registryUri: a.registryUri,
          },
        });
      },
      setPlatform: (platform: string) => {
        dispatch({
          type: 'SET_PLATFORM',
          payload: {
            platform: platform,
          },
        });
      },
    };
  }
)(AppComponent);

export default App;
