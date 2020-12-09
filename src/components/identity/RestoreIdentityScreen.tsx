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


const RestoreIdentityScreen: React.FC = (props) => {


  return (
    <IonSlide>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonLabel>Please paste your seed:</IonLabel>
          </IonCol>
        </IonRow>
        <IonRow>

        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton color="none" className="ActionButton">Next</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonSlide>
  )
};

export default RestoreIdentityScreen;
