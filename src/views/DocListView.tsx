import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import { useHistory } from 'react-router';

import {
  IonContent,
  IonModal,
  IonProgressBar,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/react';
import { qrCode } from 'ionicons/icons';

import { getBags, getBagsData, getConnected, getDocumentsAddressesInOrder, getDocumentsAwaitingSignature, getDocumentsCompleted, State } from '../store';
import Horizontal from '../components/Horizontal';
import BagItem from '../components/BagItem';
import DummyBagItem from '../components/dummy/DummyBagItem';
import ModalDocument from '../components/ModalDocument';
import ModalUploadDocument from '../components/ModalUploadDocument';
import { bagIdFromAddress } from '../utils/bagIdFromAddress';


declare global {
  interface Window {
    cordova: {
      plugins: {
        barcodeScanner: {
          scan: (a: unknown, b: unknown, c: unknown) => unknown;
        };
      };
    };
  }
}

const renderLoading = () => {
  return <IonProgressBar color="secondary" type="indeterminate" />;
};

type TRouteParams = {
  uri: string; // since it route params
};
interface DockListViewProps {
  connected: string;
  registryUri: string;
  action: 'show' | 'list' | 'upload';
  bagId?: string;
  isLoading: boolean;
  bags: State['bags'];
  bagsData: State['bagsData'];
  documentsAwaitingSignature: State['bagsData'];
  documentsAddressesInOrder: string[];
  documentsCompleted: State['bagsData'];
  searchText: string;
  platform: string;
}
const DockListViewComponent: React.FC<DockListViewProps> = props => {
  const history = useHistory();

  const scanQRCode = () => {
    window.cordova.plugins.barcodeScanner.scan(
      (result: any) => {
        const url = new URL(result.text);
        //TODO: check if link is also a valid hosted web app
        history.push(
          url.pathname + url.search
        );
      },
      (err: string) => {
        console.error(err);
      },
      {
        showTorchButton: true,
        prompt: "Scan document URL",
        formats: "QR_CODE",
        resultDisplayDuration: 0
      }
    );
  }

  return (
    <IonContent>
      { props.platform !== "web" ?
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="tertiary" onClick={scanQRCode}>
            <IonIcon icon={qrCode} />
          </IonFabButton>
        </IonFab>
        : undefined
      }
      {
        /*
        props.isLoading && props.action === "list"
        ? renderLoading()
        : undefined
        */}
      <Horizontal />
      {props.action === 'show' ? (
        <IonModal
          isOpen={true}
          onWillDismiss={() => {
            history.push('/doc/');
          }}
        >
          <ModalDocument
            registryUri={props.registryUri as string}
            bagId={props.bagId as string}
          />
        </IonModal>
      ) : (
          undefined
        )}
      {props.action === 'upload' ? (
        <IonModal
          isOpen={true}
          onWillDismiss={() => {
            history.push('/doc/');
          }}
        >
          <ModalUploadDocument />
        </IonModal>
      ) : (
          undefined
        )}
      {props.action === 'list' ? (
        <>
          {!props.isLoading
            ? props.documentsAddressesInOrder.map(address => {
                return (
                  <BagItem
                    key={address}
                    registryUri={props.registryUri}
                    id={address}
                    bag={props.bags[address]}
                    document={props.bagsData[address]}
                    onlyCompleted={false}
                    awaitsSignature={
                      !!props.documentsAwaitingSignature[address]
                    }
                    completed={
                      !!props.documentsCompleted[address]
                    }
                  />
                );
              })
            : [...Array(10)].map((x, i) => (
              <DummyBagItem key={i} id={i.toString()} />
            ))}
        </>
      ) : (
          undefined
        )}
    </IonContent>
  );
};

export const DockListView = connect((state: State) => {
  return {
    connected: getConnected(state),
    bags: getBags(state),
    bagsData: getBagsData(state),
    documentsCompleted: getDocumentsCompleted(state),
    documentsAwaitingSignature: getDocumentsAwaitingSignature(state),
    documentsAddressesInOrder: getDocumentsAddressesInOrder(state),
    isLoading: state.isLoading,
    searchText: state.searchText,
    platform: state.platform,
  };
},
  (dispatch: Dispatch) => {
    return {};
  }
)(DockListViewComponent);

export default DockListView;
