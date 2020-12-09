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
import { Bag, getBags, getDocumentsAwaitingSignature, State } from '../store';
import Horizontal from '../components/Horizontal';
import BagItem from '../components/BagItem';
import DummyBagItem from '../components/dummy/DummyBagItem';
import ModalDocument from '../components/ModalDocument';
import ModalUploadDocument from '../components/ModalUploadDocument';

import { add } from 'ionicons/icons';

const renderLoading = () => {
  return <IonProgressBar color="secondary" type="indeterminate" />;
};

type TRouteParams = {
  uri: string; // since it route params
};
interface DockListViewProps {
  action: 'show' | 'list' | 'upload';
  registryUri: string;
  bagId?: string;
  isLoading: boolean;
  bags: State['bags'];
  documentsAwaitingSignature: State['bagsData'];
  searchText: string;
}
const DockListViewComponent: React.FC<DockListViewProps> = props => {
  const history = useHistory();

  return (
    <IonContent>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton
          color="tertiary"
          onClick={() => {
            history.push('/doc/upload/');
          }}
        >
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      {/*
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
            ? Object.keys(props.bags)
                .filter(bagId => {
                  return true;
                })
                .map(bagId => {
                  return (
                    <BagItem
                      key={bagId}
                      registryUri={props.registryUri}
                      id={bagId}
                      bag={props.bags[bagId]}
                      awaitsSignature={
                        !!props.documentsAwaitingSignature[bagId]
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

export const DockListView = connect(
  (state: State) => {
    return {
      bags: getBags(state),
      documentsAwaitingSignature: getDocumentsAwaitingSignature(state),
      isLoading: state.isLoading,
      searchText: state.searchText,
    };
  },
  (dispatch: Dispatch) => {
    return {};
  }
)(DockListViewComponent);

export default DockListView;
