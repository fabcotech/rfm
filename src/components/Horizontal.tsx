import { connect } from 'react-redux';
import React from 'react';
import { Dispatch } from 'redux';
import {
  IonButton,
  IonItem,
} from '@ionic/react';

import { useHistory } from 'react-router';
import './Horizontal.scoped.css';
import { State } from '../store';

interface HorizontalProps {
  privateKey: string;
  registryUri: string;
  init: (a: { privateKey: string; registryUri: string}) => void;
}

const HorizontalComponent: React.FC<HorizontalProps> = (props) => {
  const history = useHistory();
  return (
    <IonItem detail={false}>
      <IonButton color="tertiary"
        onClick={() => {
          history.push("/doc/upload/");
        }}
      >Upload
      </IonButton>
      <IonButton color="tertiary"
        onClick={() => {
          props.init({
            privateKey: props.privateKey,
            registryUri: props.registryUri,
          })
        }}
      >Reload
      </IonButton>
    </IonItem>
  );
};

const Horizontal = connect(
  (state: State) => {
    return {
      privateKey: state.privateKey as string,
      registryUri: state.registryUri as string,
    }
  },
  (dispatch: Dispatch) => {
    return {
      init: (a: { privateKey: string; registryUri: string}) => {
        dispatch({
          type: 'INIT',
          payload: a,
        })
      }
    }
  }
)(HorizontalComponent);

export default Horizontal;
