import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonIcon,
  IonButtons,
  IonButton,
} from '@ionic/react';
import { document as documentIcon, cloudUpload } from 'ionicons/icons';
import { Plugins } from '@capacitor/core';
import { useHistory, RouteComponentProps } from 'react-router';

import generateSignature from '../utils/generateSignature';
import generateSignatureFromHash from '../utils/generateSignatureFromHash';
import {
  Bag,
  State,
  Document,
  getBags,
  getBagsData,
  getPublicKey,
  getPrivateKey,
  Signature,
} from '../store';

import './ModalUploadDocument.scoped.css';
import replacer from '../utils/replacer';
import checkSignature from 'src/utils/checkSignature';

const { FileSelector } = Plugins;

const { blake2b } = require('blakejs');

//Instead of deprecated withRouter
export const withHistory = (Component: any) => {
  return (props: any) => {
    const history = useHistory();

    return <Component history={history} {...props} />;
  };
};

interface ModalUploadDocumentProps extends RouteComponentProps {
  privateKey: string;
  publicKey: string;
  bags: { [bagId: string]: Bag };
  upload: (bagId: string, document: Document) => void;
  platform: string;
}
interface ModalUploadDocumentState {
  bagId: string;
  dropErrors: string[];
  document: undefined | Document;
  platform: string;
}
class ModalUploadDocumentComponent extends React.Component<
  ModalUploadDocumentProps,
  ModalUploadDocumentState
> {
  constructor(props: ModalUploadDocumentProps) {
    super(props);
    this.state = {
      document: undefined,
      bagId: '',
      dropErrors: [],
      platform: '',
    };
  }
  dropEl: HTMLTextAreaElement | undefined = undefined;

  blobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  nativeFilePicker = async () => {
    const that = this;
    let selectedFile = await FileSelector.fileSelector({
      multiple_selection: false,
      ext: ['.jpg', '.png', '.pdf', '.jpeg'],
    });

    const paths = JSON.parse(selectedFile.paths);
    const names = JSON.parse(selectedFile.original_names);
    const filePath = paths[0];
    const fileName = names[0];

    const fileResponse = await fetch(filePath);
    const fileBlob = await fileResponse.blob();

    const asbase: string = (await this.blobToBase64(fileBlob)) as string;

    const document: Document = {
      name: fileName,
      mimeType: fileBlob.type,
      data: Buffer.from(asbase.split(',')[1]).toString('base64'),
      signatures: {},
    };
    const signature: Signature = {
      publicKey: that.props.publicKey,
      signature: generateSignature(document, that.props.privateKey),
    };
    document.signatures['0'] = signature;

    that.setState({
      document: document,
    });
  };

  saveRef = (el: HTMLTextAreaElement) => {
    this.dropEl = el;
    if (this.dropEl) {
      this.dropEl.addEventListener('drop', (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.onDrop(e as any);
        return false;
      });
    }
  };

  onDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    const that = this;
    e.preventDefault();
    var files = e.dataTransfer.files;
    if (!files[0]) {
      this.setState({
        dropErrors: ['Please drop a file'],
      });
      return;
    }
    if (files[1]) {
      this.setState({
        dropErrors: ['Please drop only one file'],
      });
      return;
    }

    this.setState({ dropErrors: [] });
    const file = files[0];
    var r = new FileReader();
    try {
      r.onloadend = function(e) {
        if (!e || !e.target || typeof r.result !== 'string') {
          return;
        }

        const document: Document = {
          name: file.name,
          mimeType: file.type,
          data: Buffer.from(r.result.split(',')[1]).toString('base64'),
          signatures: {},
        };
        const signature: Signature = {
          publicKey: that.props.publicKey,
          signature: generateSignature(document, that.props.privateKey),
        };
        document.signatures['0'] = signature;
        console.log('verified', checkSignature(document, '0'));

        that.setState({
          document: document,
        });
      };
    } catch (e) {
      this.setState({ dropErrors: ['Error parsing file'] });
    }

    r.readAsDataURL(file);
  };

  render() {
    return (
      <>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Upload to the blockchain</IonTitle>
            <IonButtons slot="end">
              <IonButton
                onClick={() => {
                  this.props.history.replace('/doc', { direction: 'back' });
                }}
              >
                Close
              </IonButton>
            </IonButtons>
            <IonIcon icon={cloudUpload} slot="start" size="large" />
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonLabel position="floating">Document ID</IonLabel>
            <IonInput
              placeholder="document ID"
              type="text"
              value={this.state.bagId}
              onIonChange={e =>
                this.setState({ bagId: (e.target as HTMLInputElement).value })
              }
            />
          </IonItem>
          {this.props.platform === 'web' ? (
            <div className={`drop-area ${!!this.state.document ? 'hide' : ''}`}>
              <textarea ref={this.saveRef} />
              <span>
                <IonIcon icon={documentIcon} size="large" /> Drop your file
              </span>
            </div>
          ) : (
            undefined
          )}
          {this.props.platform === 'ios' ||
          this.props.platform === 'android' ? (
            <IonButton
              onClick={() => {
                this.nativeFilePicker();
              }}
            >
              Pick a document
            </IonButton>
          ) : (
            undefined
          )}
          {this.state.document ? (
            <div className="document">
              <div className="left">
                <IonIcon icon={documentIcon} size="large" />
              </div>
              <div className="right">
                <h5>{this.state.document.name}</h5>
                <h5>{this.state.document.mimeType}</h5>
              </div>
            </div>
          ) : (
            undefined
          )}
          {this.state.document ? (
            <IonItem>
              <IonButton
                disabled={!this.state.document || !this.state.bagId}
                size="small"
                onClick={() => {
                  this.props.upload(this.state.bagId, this.state
                    .document as Document);
                }}
              >
                Upload
              </IonButton>
              <IonButton
                color="light"
                size="small"
                onClick={() => {
                  this.setState({ document: undefined });
                }}
              >
                Cancel
              </IonButton>
            </IonItem>
          ) : (
            undefined
          )}
        </IonContent>
      </>
    );
  }
}

const ModalUploadDocument = connect(
  (state: State) => {
    return {
      privateKey: getPrivateKey(state) as string,
      bags: getBags(state),
      bagsData: getBagsData(state),
      publicKey: getPublicKey(state) as string,
      platform: state.platform,
    };
  },
  (dispatch: Dispatch) => {
    return {
      upload: (bagId: string, document: Document) => {
        dispatch({
          type: 'UPLOAD',
          payload: {
            bagId: bagId,
            document: document,
          },
        });
      },
    };
  }
)(ModalUploadDocumentComponent);

export default withHistory(ModalUploadDocument);
