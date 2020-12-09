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

import Avatar from '../../assets/avatar.jpg';

const IdentityScreenComponent: React.FC = (props) => {

  return (
        <IonSlide>
          <IonGrid>
            <img className="Avatar" src={Avatar} alt="Avatar"/>
            <IonRow>
              <IonCol>
                <IonLabel>Theo Hallenius</IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel>did:rchain:fer3fs..kcer2</IonLabel>
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

export default IdentityScreenComponent;
