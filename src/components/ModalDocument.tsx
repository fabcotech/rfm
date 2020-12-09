import React, { useEffect, useState } from 'react';
import { IonHeader, IonContent, IonToolbar, IonTitle, IonLoading, IonIcon, IonButtons, IonButton, IonProgressBar } from '@ionic/react';
import { State } from '../store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { document as documentIcon } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { Document, Page, pdfjs } from 'react-pdf';

import './ModalDocument.scoped.css';

import QRCodeComponent from './QRCodeComponent';

interface ModalDocumentProps {
  registryUri: string,
  bagId: string;
  bags: State["bags"];
  bagsData: State["bagsData"];
  loadBag: (registryUri: string, bagId: string) => void;
}

const ModalDocumentComponent: React.FC<ModalDocumentProps> = (props: ModalDocumentProps) => {
  const history = useHistory();
  const pdfcontent64 = "";
  const [page, setPage] = useState<number>();
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  useEffect(() => {
    props.loadBag(props.registryUri, props.bagId);
  });

  const renderLoading = () => {
    return <IonProgressBar color="secondary" type="indeterminate"></IonProgressBar>
  };

  const document = props.bagsData[props.registryUri + "/" + props.bagId];
  return <>
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>Document Viewer</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={() => {
            history.replace('/doc', { direction: 'back' })
          }}>
            Close
          </IonButton>
        </IonButtons>
        <IonIcon icon={documentIcon} slot="start" size="large"></IonIcon>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      {
        document ?
          <Document file={"data:application/pdf;base64," + document.data} loading={renderLoading}>

            <Page pageNumber={page} pageIndex={0} />
          </Document> : <React.Fragment></React.Fragment>
      }
      {
        typeof document === 'undefined' ?
          <IonLoading isOpen={true}></IonLoading> : undefined
      }
      {
        document === null ?
          <span>No document attached</span> :
          <div className="qrCodeContainer">
            <QRCodeComponent url={`http://localhost:3000/doc/show/${props.registryUri}/${props.bagId}`} />
          </div>
      }
      {
        document ?
          <div className="document">
            <div className="left">
              {
                ['image/png', 'image/jpg', 'image/jpeg'].includes(document.mimeType) ?
                  <img
                    alt={document.name}
                    src={`data:${document.mimeType};base64, ${document.data}`}
                  ></img> : <React.Fragment></React.Fragment>
              }
            </div>
            <div className="right">
              <h5>{props.bagsData[props.registryUri + "/" + props.bagId].name}</h5>
              <h5>{props.bagsData[props.registryUri + "/" + props.bagId].mimeType}</h5>
            </div>
          </div> : undefined
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
      loadBag: (registryUri: string, bagId: string) => {
        dispatch({
          type: 'LOAD_BAG_DATA',
          payload: {
            registryUri: registryUri,
            bagId: bagId,
          }
        })
      }
    }
  }
)(ModalDocumentComponent);

export default ModalDocument;