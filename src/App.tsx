import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonLabel,
  IonItem,
  IonButton,
  IonLoading
} from '@ionic/react';
import './App.css';
import { Bag, State } from './store';
import BagItem from './components/BagItem';

interface AppProps {
  isLoading: boolean;
  registryUri: undefined | string;
  bags: { [id: string]: Bag }
  init: (a: { registryUri: string, privateKey: string }) => void;
  SetLoading: (isLoadig: boolean) => void;
}
const AppComponent: React.FC<AppProps> = (props) => {

  const [privateKey, setPrivateKey] = useState<string>('');
  const [registryUri, setRegstryUri] = useState<string>('');

  return (
  <IonPage id="home-page">
    <IonHeader>
      <IonToolbar>
        <IonTitle>RFM</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      {
      props.registryUri
      ?
      <React.Fragment>
          <IonLoading isOpen={props.isLoading}></IonLoading> {
          Object.keys(props.bags).map(bagId => {
            console.log(bagId, props.bags[bagId]);
            return <BagItem key={bagId} id={bagId} bag={props.bags[bagId]} />
          })
      }</React.Fragment>
      :
      <React.Fragment>
        <form className="ion-padding">
          <IonItem>
            <IonLabel position="floating">Private key</IonLabel>
            <IonInput
              placeholder="private key" 
              type="password" 
              value={privateKey}
              onIonChange={(e) => setPrivateKey((e.target as HTMLInputElement).value)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Address</IonLabel>
            <IonInput
              placeholder="address" 
              type="text" 
              value={registryUri}
              onIonChange={(e) => setRegstryUri((e.target as HTMLInputElement).value)}
            ></IonInput>
          </IonItem>
          <IonButton
            type="button"
            onClick={(e) => {
              props.SetLoading(true);
              props.init({ privateKey, registryUri });
            }}
            disabled={typeof registryUri !== "string" || typeof privateKey !== "string"}
          >Retrieve files</IonButton>
        </form>
        </React.Fragment>
      }
    </IonContent>
  </IonPage>
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
    SetLoading: (isLoading: boolean) => {
      dispatch({
        type: 'SET_LOADING',
        payload: isLoading
      })
    }
  }
})(AppComponent);

export default App;
