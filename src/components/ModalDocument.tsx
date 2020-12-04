import React, { useEffect } from 'react';
import {IonHeader, IonContent, IonToolbar, IonTitle, IonLoading, IonIcon} from '@ionic/react';
import { State } from '../store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { document as documentIcon } from 'ionicons/icons';

import './ModalDocument.css';

interface ModalDocumentProps {
  bagId: string;
  bags: State["bags"];
  bagsData: State["bagsData"];
  loadBag: (bagId: string) => void;
}

const ModalDocumentComponent: React.FC<ModalDocumentProps> = (props: ModalDocumentProps) => {

  useEffect(() => {
    props.loadBag(props.bagId);
  }, []);

  const document = props.bagsData[props.bagId];
  return <>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>Document Viewer</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      {
        typeof document === 'undefined' ?
        <IonLoading isOpen={true}></IonLoading> : undefined
      }
      {
        document === null ?
        <span>No document attached</span> : undefined
      }
      {
        document ?
        <div className="document">
          <div className="left">
            {
              ['image/png', 'image/jpg', 'image/jpeg'].includes(document.mimeType) ?
              <img
                src={`data:${document.mimeType};base64, ${document.data}`}
              ></img> :
              <IonIcon size="large" icon={documentIcon}/>
            }
          </div>
          <div className="right">
            <h5>{props.bagsData[props.bagId].name}</h5>
            <h5>{props.bagsData[props.bagId].mimeType}</h5>
          </div>
        </div>        : undefined
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
    return {
      loadBag: (bagId: string) => {
        dispatch({
          type: 'LOAD_BAG_DATA',
          payload: {
            bagId: bagId,
          }
        })
      }
    }
  }
)(ModalDocumentComponent);

export default ModalDocument;