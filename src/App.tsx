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
} from '@ionic/react';
import './App.css';
import { Bag, State } from './store';
import BagItem from './components/BagItem';

interface AppProps {
  registryUri: undefined | string;
  bags: { [id: string]: Bag }
  init: (a: { registryUri: string, privateKey: string }) => void;
}
const AppComponent: React.FC<AppProps> = (props) => {

  const [privateKey, setPrivateKey] = useState<string>('');
  const [registryUri, setRegstryUri] = useState<string>('');

  if (props.registryUri) {
    return (
      <IonPage id="home-page">
        <IonHeader>
          <IonToolbar>
            <IonTitle>RFM</IonTitle>
          </IonToolbar>
          <IonContent fullscreen>
            {
              Object.keys(props.bags).map(bagId => {
                console.log(bagId, props.bags[bagId]);
                return <BagItem key={bagId} id={bagId} bag={props.bags[bagId]} />
              })
            }
          </IonContent>
        </IonHeader>
      </IonPage>
    )
  }
  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>RFM</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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
              props.init({ privateKey, registryUri });
            }}
            disabled={typeof registryUri !== "string" || typeof privateKey !== "string"}
          >Retrieve files</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export const App = connect((state: State) => {
  return {
    registryUri: state.registryUri,
    bags: state.bags,
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
