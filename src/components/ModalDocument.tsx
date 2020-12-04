import React from 'react';
import {IonHeader, IonContent, IonToolbar, IonTitle, IonLoading} from '@ionic/react';
import { Dispatch } from 'redux';
import { Bag, State } from '../store';
import { connect } from 'react-redux';

interface ModalDocumentProps {
  bags: { [bagId: string]: Bag };
  bagsData: { [bagId: string]: Document };
}

const ModalDocumentComponent: React.FC<ModalDocumentProps> = (props) => {
  return <>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>Document Viewer</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      {
        typeof props.bagsData[props.bagId] === 'undefined' ?
        <IonLoading isOpen={true}></IonLoading> : undefined
      }
      {
        props.bagsData[props.bagId] === null ?
        <span>No document attached</span> : undefined
      }
      {
        props.bagsData[props.bagId] ?
        <span>No document attached</span> : undefined
      }
    </IonContent>
  </>
}

const ModalDocument = connect(
  (state: State) => {
    return {
      bags: state.bags,
      bagsData: state.bagsData,
    }
  },
  (dispatch: Dispatch) => {
    return {}
  },
)(ModalDocumentComponent);

export default ModalDocument;