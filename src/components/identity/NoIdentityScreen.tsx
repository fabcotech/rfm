import React from 'react';
import { useHistory } from 'react-router';

import {
  IonLabel,
  IonButton,
  IonSlide,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import './IdentityScreen.scoped.css';

import { ReactComponent as GhostLogo } from '../../assets/ghost.svg';

const NoIdentityScreenComponent: React.FC = (props) => {

  const history = useHistory();

  return (
    <IonSlide>
      <IonGrid>
        <GhostLogo />
        <IonRow>
          <IonCol>
            <IonLabel>You have no identity</IonLabel>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton color="none" className="ActionButton" onClick={() => {
              history.push("/user/new");
            }}>Create New</IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton color="none" className="ActionButton" onClick={() => {
              history.push("/user/restore");
            }}>Import Seed</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonSlide>
  )
};

export default NoIdentityScreenComponent;
