import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, useParams, useLocation } from 'react-router-dom';
import { useHistory, RouteComponentProps } from 'react-router';

import {
  IonLoading,
  IonContent,
  IonModal,
  IonButton
} from '@ionic/react';
import { Bag, State } from '../store';
import Horizontal from '../components/Horizontal';
import BagItem from '../components/BagItem';
import DummyBagItem from '../components/dummy/DummyBagItem';
import ModalDocument from '../components/ModalDocument';
import ModalUploadDocument from '../components/ModalUploadDocument';

type TRouteParams = {
  uri: string; // since it route params
}
interface DockListViewProps {
  isLoading: boolean;
  bags: { [id: string]: Bag }
}
const DockListViewComponent: React.FC<DockListViewProps> = (props) => {
  const history = useHistory();
  let { uri } = useParams();

  const [showModal, setShowModal] = useState<false | 'show' | 'upload'>(false);
  const location = useLocation()

  //Route watcher
  useEffect(() => {
    if (uri && uri.includes('show')) {
      setShowModal('show');
    } else if (uri && uri.includes('upload')) {
      setShowModal('upload');
    } else {
      setShowModal(false);
    }
  }, [location]);

  return (
    <IonContent>
      <IonModal isOpen={showModal === 'show'}>
        <ModalDocument></ModalDocument>
        <IonButton onClick={() => {
          history.replace('/doc', { direction: 'back' })
        }}>
            Close
        </IonButton>
      </IonModal>
      <IonModal isOpen={showModal === 'upload'}>
        <ModalUploadDocument></ModalUploadDocument>
        <IonButton onClick={() => {
          history.replace('/doc', { direction: 'back' })
        }}>
            Close
        </IonButton>
      </IonModal>
      <IonLoading isOpen={props.isLoading && !showModal}></IonLoading>
      <Horizontal />
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
