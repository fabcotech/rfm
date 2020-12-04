import React, { useEffect, useState } from 'react';
import {IonHeader, IonContent, IonToolbar, IonTitle, IonLoading} from '@ionic/react';
import { Bag, State } from '../store';
import { connect } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';

interface ModalDocumentProps {
  bags: { [bagId: string]: Bag };
  bagsData: { [bagId: string]: Document };
}

const ModalDocumentComponent: React.FC<ModalDocumentProps> = (props: ModalDocumentProps) => {
  const history = useHistory();
  let { uri } = useParams();
  const location = useLocation()
  const [bagId, setBagId] = useState<string>('');

  useEffect(() => {
    console.log('uri', uri)
    if (uri) {
      const bagId = uri.slice('/')[uri.slice('/').length - 1];
      setBagId(bagId);
    } else {
      setBagId('');
    }
  }, [location]);

  return <>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>Document Viewer</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      {
        typeof props.bagsData[bagId] === 'undefined' ?
        <IonLoading isOpen={true}></IonLoading> : undefined
      }
      {
        props.bagsData[bagId] === null ?
        <span>No document attached</span> : undefined
      }
      {
        props.bagsData[bagId] ?
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
  undefined,
)(ModalDocumentComponent);

export default ModalDocument;