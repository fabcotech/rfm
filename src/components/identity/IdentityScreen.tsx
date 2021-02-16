import React from 'react';

import {
  IonLabel,
  IonButton,
  IonSlide,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import './IdentityScreen.scoped.css';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { HistoryState } from '../../store';
import QRCodeComponent from '../QRCodeComponent';

//import Avatar from '../../assets/avatar.jpg';

interface IdentityScreenComponentProps {
  registryUri: string | undefined;
}
const IdentityScreenComponent: React.FC<IdentityScreenComponentProps> = (props) => {

  const shortenName = () => {
    return "did:rchain:" + props.registryUri?.substring(0, 6) + "..." + props.registryUri?.substring(48, 54)
  }

  const qrCodeContent = () => {
    return `did:rchain:${props.registryUri}`;
  }

  return (
    <IonSlide>
      <IonGrid>
        {/* (<img className="Avatar" src={Avatar} alt="Avatar" />) */}
        <QRCodeComponent
          url={qrCodeContent()}
        />
        <IonRow>
          <IonCol>
            <IonLabel>Theo Hallenius</IonLabel>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            {(props.registryUri ? <IonLabel>{shortenName()}</IonLabel> : undefined)}
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton color="primary">Backup Identity</IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton color="primary">Remove Identity</IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonLabel>Issuer: Self-issued</IonLabel>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonSlide>
  )
};

const IdentityScreen = connect(
  (state: HistoryState) => {
    return {
      registryUri: state.reducer.registryUri
    }
  },
  (dispatch: Dispatch) => { }
)(IdentityScreenComponent);

export default IdentityScreen;

