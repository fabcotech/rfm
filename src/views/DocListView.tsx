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
import BagItem from '../components/BagItem';
import DummyBagItem from '../components/dummy/DummyBagItem';
import ModalDocument from '../components/ModalDocument';

type TRouteParams = {
  uri: string; // since it route params
}
interface DockListViewProps {
  isLoading: boolean;
  registryUri: undefined | string;
  bags: { [id: string]: Bag }
  init: (a: { registryUri: string, privateKey: string }) => void;
}
const DockListViewComponent: React.FC<DockListViewProps> = (props) => {
  const history = useHistory();
  let { uri } = useParams();

  const [privateKey, setPrivateKey] = useState<string>('');
  const [registryUri, setRegstryUri] = useState<string>('9febstt6fy4wxwj3qbf6r9zoqrgnoyjq9k6fsy96djwywqu9ud3up7');
  const [showModal, setShowModal] = useState(false);
  const location = useLocation()

  //Constructor
  useEffect(() => {
    props.init({ privateKey, registryUri });
  }, []);

  //Route watcher
  useEffect(() => {
    props.init({ privateKey, registryUri });
    
    if (uri) {
      setShowModal(true);
    }
    else {
      setShowModal(false);
    }
  }, [location]);

  return (
    props.registryUri
    ?
    <IonContent>
      <IonModal isOpen={showModal}>
        <ModalDocument></ModalDocument>
        <IonButton onClick={() => {
          history.replace('/doc', { direction: 'back' })
        }}>
            Close
        </IonButton>
      </IonModal>
        <IonLoading isOpen={props.isLoading && !showModal}></IonLoading> {
        !props.isLoading
        ?
          Object.keys(props.bags).map(bagId => {
            return <BagItem key={bagId} id={bagId} bag={props.bags[bagId]} />
          })
        :
        [...Array(10)].map((x, i) =>
          <DummyBagItem key={i} id={i.toString()} />
        )
    }    </IonContent>
    :
    <React.Fragment></React.Fragment>
    );
};

export const DockListView = connect((state: State) => {
  return {
    registryUri: state.registryUri,
    bags: state.bags,
    isLoading: state.isLoading,
  }
}, (dispatch: Dispatch) => {
  return {
    init: (a: { registryUri: string, privateKey: string }) => {
      dispatch({
        type: 'INIT',
        payload: {
          privateKey: a.privateKey,
          registryUri: a.registryUri,
        }
      })
    }
  }
})(DockListViewComponent);

export default DockListView;
