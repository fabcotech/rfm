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
  IonIcon
} from '@ionic/react';
import { Bag, State } from '../store';
import Horizontal from '../components/Horizontal';
import BagItem from '../components/BagItem';
import DummyBagItem from '../components/dummy/DummyBagItem';
import ModalDocument from '../components/ModalDocument';
import ModalUploadDocument from '../components/ModalUploadDocument';

import { add } from 'ionicons/icons';

const renderLoading = () => {
  return <IonProgressBar color="secondary" type="indeterminate"></IonProgressBar>
};

type TRouteParams = {
  uri: string; // since it route params
}
interface DockListViewProps {
  action: 'show' | 'list' | 'upload';
  bagId?: string;
  isLoading: boolean;
  bags: { [id: string]: Bag };
  searchText: string;
}
const DockListViewComponent: React.FC<DockListViewProps> = (props) => {
  const history = useHistory();

  return (
    <IonContent>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="tertiary" onClick={() => {
                  history.push("/doc/upload/");
                }}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        {
        /*
        props.isLoading && props.action === "list"
        ? renderLoading()
        : undefined
        */
      }
      <Horizontal />
      {
        props.action === "show" ?
        <IonModal isOpen={true} onWillDismiss={() => { history.push("/doc/") }}>
          <ModalDocument bagId={props.bagId as string}></ModalDocument>
        </IonModal> : undefined
      }
      {
        props.action === "upload" ?
        <IonModal isOpen={true} onWillDismiss={() => { history.push("/doc/") }}>
          <ModalUploadDocument></ModalUploadDocument>
        </IonModal> : undefined
      }
      {
        props.action === "list" ?
        <>
          {
            !props.isLoading ?
              Object.keys(props.bags).filter(bagId =>  { return true } ).map(bagId => {
                return <BagItem key={bagId} id={bagId} bag={props.bags[bagId]} />
              })
              :
              [...Array(10)].map((x, i) =>
                <DummyBagItem key={i} id={i.toString()} />
              )
          }
        </> : undefined
      }
    </IonContent>
  )
};

export const DockListView = connect((state: State) => {
  return {
    bags: state.bags,
    isLoading: state.isLoading,
    searchText: state.searchText
  }
}, (dispatch: Dispatch) => {
  return {}
})(DockListViewComponent);

export default DockListView;
