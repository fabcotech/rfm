import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import React, { useState } from 'react';

import {
  IonContent,
  IonItem,
  IonInput,
  IonLabel,
  IonButton,
  IonSlides,
  IonSlide,
  IonGrid,
  IonRow,
  IonCol,
  IonToggle
} from '@ionic/react';
import './LoginView.scoped.css';

import {ReactComponent as GhostLogo} from '../assets/ghost.svg';

interface LoginViewProps {
  init: (a: { registryUri: string, privateKey: string }) => void;
}
const LoginViewComponent: React.FC<LoginViewProps> = (props) => {
  const [privateKey, setPrivateKey] = useState<string>('');
  const [registryUri, setRegstryUri] = useState<string>('');

  const [devLogin, setDevLogin] = useState(false);

  const slides = React.useRef(null);

  const slideOpts: Record<string, unknown> = {
    initialSlide: 0,
    speed: 400
  };

  return (
    <IonContent>
      <IonSlides
      class="Instructions"
      options={slideOpts}
      pager={true}
      onIonSlideDidChange={(event: any)=> console.info(event)}
      >
        <IonSlide>
          {
          devLogin
          ?
          <React.Fragment>
          <IonGrid>
            <IonRow>
              <IonItem>
              <IonLabel position="floating">Address</IonLabel>
              <IonInput
                placeholder="address" 
                type="text" 
                value={registryUri}
                onIonChange={(e) => setRegstryUri((e.target as HTMLInputElement).value)}
              ></IonInput>
            </IonItem>
          </IonRow>
          <IonRow>
        <IonItem>
          <IonLabel position="floating">Private key</IonLabel>
          <IonInput
            placeholder="Private key" 
            type="password" 
            value={privateKey}
            onIonChange={(e) => setPrivateKey((e.target as HTMLInputElement).value)}
          ></IonInput>
        </IonItem>
        </IonRow>
        <IonRow>
        <IonItem>
          <IonButton
            disabled={!privateKey || !registryUri}
            onClick={() => {
              props.init({
                registryUri,
                privateKey,
              })
            }}
          >
            Load
          </IonButton>
        </IonItem>
        </IonRow>
        </IonGrid>
        </React.Fragment>
        :
        <React.Fragment>
          <IonGrid>
            <GhostLogo />
            <IonRow>
              <IonCol>
                <IonLabel>You have no identity</IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton color="none" className="ActionButton">Create New</IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton color="none" className="ActionButton">Import Seed</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          </React.Fragment>
          }
          <div className="BottomBar">
          <IonItem>
            <IonLabel>Dev Login: </IonLabel>
            <IonToggle color="secondary" checked={devLogin} onIonChange={e => setDevLogin(e.detail.checked)} />
          </IonItem>
          </div>
        </IonSlide>
        <IonSlide>
          Slide2
        </IonSlide>
      </IonSlides>
    </IonContent>
  )
};

export const LoginView = connect(
  undefined, (dispatch: Dispatch) => {
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
})(LoginViewComponent);

export default LoginView;
