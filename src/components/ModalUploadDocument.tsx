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
import { document as documentIcon } from 'ionicons/icons';
import { Plugins } from '@capacitor/core';
import { useHistory, RouteComponentProps } from 'react-router';

import {
  Bag,
  Document,
  getBags,
  getBagsData,
  getPublicKey,
  HistoryState,
  getPlatform,
} from '../store';

import './ModalUploadDocument.scoped.css';

const { FileSelector } = Plugins;

//Instead of deprecated withRouter
export const withHistory = (Component: any) => {
  return (props: any) => {
    const history = useHistory();

    return <Component history={history} {...props} />;
  };
};

interface ModalUploadDocumentProps extends RouteComponentProps {
  state: HistoryState;
  publicKey: string;
  bags: { [bagId: string]: Bag };
  upload: (bagId: string, document: Document, did: string) => void;
  platform: string;
  //recipient: string;
}
interface ModalUploadDocumentState {
  recipient: string;
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
      recipient: '',
      bagId: '',
      dropErrors: [],
      platform: props.platform,
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
      date: new Date().toUTCString(),
    };

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
      r.onloadend = async function(e) {
        if (!e || !e.target || typeof r.result !== 'string') {
          return;
        }

        const document: Document = {
          name: file.name,
          mimeType: file.type,
          data: Buffer.from(r.result.split(',')[1]).toString('base64'),
          signatures: {},
          date: new Date().toUTCString(),
        };

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
      <IonContent class="modal-document">
        <IonTitle class="upload-to-the-blockchain">
          Upload to the blockchain
        </IonTitle>

        <IonButtons className="ButtonArray">
          <IonButton
            color="primary"
            onClick={() => {
              this.props.history.replace('/doc', { direction: 'back' });
            }}
          >
            Close
          </IonButton>
        </IonButtons>

        <IonContent class="inner">
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

          <IonItem>
            <IonLabel position="floating">Request signature from</IonLabel>
            <IonInput
              placeholder="did:rchain:<registryUri>"
              type="text"
              value={this.state.recipient}
              onIonChange={e =>
                this.setState({
                  recipient: (e.target as HTMLInputElement).value,
                })
              }
            />
          </IonItem>

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
                size="default"
                onClick={() => {
                  this.props.upload(
                    this.state.bagId,
                    this.state.document as Document,
                    this.state.recipient as string
                  );
                }}
              >
                Upload
              </IonButton>
              <IonButton
                color="light"
                size="default"
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
      </IonContent>
    );
  }
}

const ModalUploadDocument = connect(
  (state: HistoryState) => {
    return {
      state: state,
      bags: getBags(state),
      bagsData: getBagsData(state),
      publicKey: getPublicKey(state) as string,
      platform: getPlatform(state),
    };
  },
  (dispatch: Dispatch) => {
    return {
      upload: (bagId: string, document: Document, did: string) => {
        dispatch({
          type: 'UPLOAD',
          payload: {
            bagId: bagId,
            document: document,
            recipient: did,
          },
        });
      },
    };
  }
)(ModalUploadDocumentComponent);

export default withHistory(ModalUploadDocument);
