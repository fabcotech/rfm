import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {IonHeader, IonContent, IonToolbar, IonTitle, IonItem, IonLabel, IonInput, IonIcon, IonButtons, IonButton } from '@ionic/react';
import { document as documentIcon, cloudUpload } from 'ionicons/icons';

import { useHistory, RouteComponentProps } from 'react-router';

import './ModalUploadDocument.css';
import { Bag, State, Document } from '../store';


//Instead of deprecated withRouter
export const withHistory = (Component: any) => {
  return (props: any) => {
    const history = useHistory();

    return <Component history={history} {...props} />;
  };
};

interface ModalUploadDocumentProps extends RouteComponentProps {
  bags: { [bagId: string]: Bag };
  upload: (bagId: string, document: Document) => void
}
interface ModalUploadDocumentState {
  bagId: string;
  dropErrors: string[];
  document: undefined | Document;
}
class ModalUploadDocumentComponent extends React.Component<ModalUploadDocumentProps, ModalUploadDocumentState> {
  constructor(props: ModalUploadDocumentProps) {
    super(props);
    this.state = {
      document: undefined,
      bagId: '',
      dropErrors: []
    }
  }
  dropEl: HTMLTextAreaElement | undefined = undefined;

  saveRef = (el: HTMLTextAreaElement) => {
    this.dropEl = el;
    if (this.dropEl) {
      this.dropEl.addEventListener(
        'drop',
        (e: DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          this.onDrop(e as any);
          return false;
        }
      );
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
      r.onloadend = function (e) {
        if (!e || !e.target || typeof r.result !== 'string') {
          return;
        }

        that.setState({
          document: {
            name: file.name,
            mimeType: file.type,
            data: r.result.split(',')[1],
          },
        });
      };
    } catch (e) {
      this.setState({ dropErrors: ['Error parsing file'] });
    }

    r.readAsDataURL(file);
  };

  render() {
    return <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Upload to the blockchain</IonTitle>
            <IonButtons slot="end">
            <IonButton onClick={() => {
              this.props.history.replace('/doc', { direction: 'back' })
            }}>
                Close
            </IonButton>
          </IonButtons>
          <IonIcon icon={cloudUpload} slot="start" size="large"></IonIcon>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Document ID</IonLabel>
          <IonInput
            placeholder="document ID" 
            type="text" 
            value={this.state.bagId}
            onIonChange={(e) =>
              this.setState({ bagId: (e.target as HTMLInputElement).value })
            }
          ></IonInput>
        </IonItem>
        <div className={`drop-area ${!!this.state.document ? 'hide' : ''}`}>
          <textarea ref={this.saveRef} />
          <span><IonIcon icon={documentIcon} size="large"/> Drop your file</span>
        </div>
        {
          this.state.document ?
          <div className="document">
            <div className="left">
            <IonIcon icon={documentIcon} size="large"/>
            </div>
            <div className="right">
              <h5>{this.state.document.name}</h5>
              <h5>{this.state.document.mimeType}</h5>
            </div>
          </div> :
          undefined
        }
        {
          this.state.document ?
          <IonItem>
            <IonButton
              disabled={!this.state.document || !this.state.bagId}
              size="small"
              onClick={() => {
                this.props.upload(this.state.bagId, this.state.document as Document)
              }}
            >
              Upload
            </IonButton>
            <IonButton color="light" size="small" onClick={() => {
              this.setState({ document: undefined })
            }}>Cancel</IonButton>
          </IonItem>
          : undefined
        }
      </IonContent>
    </>
  };

}

const ModalUploadDocument = connect(
  (state: State) => {
    return {
      bags: state.bags,
      bagsData: state.bagsData,
    }
  },
  (dispatch: Dispatch) => {
    return {
      upload: (bagId: string, document: Document) => {
        dispatch({
          type: 'UPLOAD',
          payload: {
            bagId: bagId,
            document: document,
          }
        })
      }
    }
  },
)(ModalUploadDocumentComponent);

export default withHistory(ModalUploadDocument);