import React, { useEffect, useState } from 'react';
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonLoading,
  IonButtons,
  IonButton,
  IonProgressBar,
} from '@ionic/react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { useHistory } from 'react-router';
import { Page, pdfjs, Document as PdfDocument } from 'react-pdf';

import QRCodeComponent from './QRCodeComponent';
import checkSignature from '../utils/checkSignature';
import { State, Document } from '../store';

import './ModalDocument.scoped.css';
import { addressFromBagId } from 'src/utils/addressFromBagId';

interface ModalDocumentProps {
  registryUri: string;
  bagId: string;
  bags: State['bags'];
  bagsData: State['bagsData'];
  loadBag: (registryUri: string, bagId: string) => void;
  reupload: (resitryUri: string, bagId: string) => void;
}

const ModalDocumentComponent: React.FC<ModalDocumentProps> = (
  props: ModalDocumentProps
) => {
  const history = useHistory();
  const pdfcontent64 = '';
  const [page, setPage] = useState<number>();
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version
    }/pdf.worker.js`;

  useEffect(() => {
    props.loadBag(props.registryUri, props.bagId);
  });

  const renderLoading = () => {
    return <IonProgressBar color="secondary" type="indeterminate" />;
  };

  const address = addressFromBagId(props.registryUri, props.bagId);

  const document = props.bagsData[address];
  let signedDocument: Document | undefined;
  if (document) {
    signedDocument = {
      ...document,
      data: Buffer.from(document.data, 'utf-8').toString('base64'),
    };
  }
  let lastSignature = undefined;
  if (document && document.signatures) {
    if (document.signatures["0"]) lastSignature = "0";
    if (document.signatures["1"]) lastSignature = "1";
    if (document.signatures["2"]) lastSignature = "2";
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{props.bagId}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                history.replace('/doc', { direction: 'back' });
              }}
            >
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* document ? (
          <PdfDocument
            file={'data:application/pdf;base64,' + document.data}
            loading={renderLoading}
          >
            <Page pageNumber={page} pageIndex={0} />
          </PdfDocument>
        ) : (
            <React.Fragment />
          ) */}
        {typeof document === 'undefined' ? (
          <IonLoading isOpen={true} />
        ) : (
            undefined
          )}
        {document === null ? (
          <span className="no-document">No document attached</span>
        ) : (
            <div className="qrCodeContainer">
              <QRCodeComponent url={`http://localhost:3000/doc/show/${props.registryUri}/${props.bagId}`} />
            </div>
          )}
        {document ? (
          <div className="ps5">
            <div className="document">
              <div className="left">
                {['image/png', 'image/jpg', 'image/jpeg'].includes(
                  document.mimeType
                ) ? (
                    <img
                      alt={document.name}
                      src={`data:${document.mimeType};base64, ${document.data}`}
                    />
                  ) : (
                    <React.Fragment />
                  )}
                                  {['application/pdf'].includes(
                  document.mimeType
                ) ? (
                    <div
                      className="pdf"
                      
                    ><span>PDF</span></div>
                  ) : (
                    <React.Fragment />
                  )}
              </div>
              <div className="right">
                <h5>
                  {props.bagsData[address].name}
                </h5>
                <h5>
                  Date (UTC) {props.bagsData[address].date}
                </h5>
                <h5>
                  {
                    props.bagsData[address].mimeType
                  }
                </h5>
              </div>
            </div>
            {Object.keys(document.signatures).map(s => {
              return (
                <p className="signature-line" key={s}>
                  {checkSignature(signedDocument as Document, s)
                    ? <>
                      <span className="signature-ok">✓</span>
                      {`signature n°${s} verified (${document.signatures[s].publicKey.slice(
                      0,
                      12
                    )}…)`}
                    </>
                    : <>
                      <span>✗</span>
                      {`signature n°${s} invalid (${document.signatures[s].publicKey.slice(
                      0,
                      12
                    )}…)`}
                    </>
                  }
                </p>
              );
            })}
            {
              [undefined, "0", "1"].includes(lastSignature) &&
              <IonButton
                size="default"
                onClick={() => {
                  props.reupload(props.registryUri, props.bagId);
                }}
              >
                Re-upload and sign
              </IonButton>
            }
          </div>
        ) : (
            undefined
          )}
      </IonContent>
    </>
  );
};

const ModalDocument = connect(
  (state: State) => {
    return {
      bags: state.bags,
      bagsData: state.bagsData,
    };
  },
  (dispatch: Dispatch) => {
    return {
      loadBag: (registryUri: string, bagId: string) => {
        dispatch({
          type: 'LOAD_BAG_DATA',
          payload: {
            registryUri: registryUri,
            bagId: bagId,
          },
        });
      },
      reupload: (registryUri: string, bagId: string) => {
        dispatch({
          type: 'REUPLOAD_BAG_DATA',
          payload: {
            bagId: bagId,
            registryUri: registryUri,
          },
        });
      },
    };
  }
)(ModalDocumentComponent);

export default ModalDocument;
