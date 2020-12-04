import React from 'react';
import {IonHeader, IonContent, IonToolbar, IonTitle} from '@ionic/react';

class ModalDocument extends React.Component {

  render() {
    return <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Document Viewer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>TODO: render PDF or Photo</p>
      </IonContent>
    </>
  };

}

export default ModalDocument;