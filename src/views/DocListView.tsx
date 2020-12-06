import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import { useHistory } from 'react-router';

import {
  IonLoading,
  IonContent,
  IonModal,
  IonProgressBar
} from '@ionic/react';
import { Bag, State } from '../store';
import Horizontal from '../components/Horizontal';
import BagItem from '../components/BagItem';
import DummyBagItem from '../components/dummy/DummyBagItem';
import ModalDocument from '../components/ModalDocument';
import ModalUploadDocument from '../components/ModalUploadDocument';

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
  bags: { [id: string]: Bag }
}
const DockListViewComponent: React.FC<DockListViewProps> = (props) => {
  const history = useHistory();

  return (
    <IonContent>
      {
        props.isLoading && props.action === "list"
        ? renderLoading()
        : undefined
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
              Object.keys(props.bags).map(bagId => {
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
  }
}, (dispatch: Dispatch) => {
  return {}
})(DockListViewComponent);

export default DockListView;
