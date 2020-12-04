import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import React, { useState } from 'react';

import {
  IonContent,
  IonItem,
  IonInput,
  IonLabel,
  IonButton
} from '@ionic/react';
import './LoginView.css';
import { State } from '../store';

interface LoginViewProps {
  init: (a: { registryUri: string, privateKey: string }) => void;
}
const LoginViewComponent: React.FC<LoginViewProps> = (props) => {
  const [privateKey, setPrivateKey] = useState<string>('');
  const [registryUri, setRegstryUri] = useState<string>('');

  return (
    <IonContent>
      <IonItem>
        <IonLabel position="floating">Address</IonLabel>
        <IonInput
          placeholder="address" 
          type="text" 
          value={registryUri}
          onIonChange={(e) => setRegstryUri((e.target as HTMLInputElement).value)}
        ></IonInput>
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Private key</IonLabel>
        <IonInput
          placeholder="Private key" 
          type="password" 
          value={privateKey}
          onIonChange={(e) => setPrivateKey((e.target as HTMLInputElement).value)}
        ></IonInput>
      </IonItem>
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
