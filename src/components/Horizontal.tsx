import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import { Dispatch } from 'redux';
import * as rchainToolkit from 'rchain-toolkit';
import {
  IonItem,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import { refreshOutline } from 'ionicons/icons';

import { useHistory } from 'react-router';
import './Horizontal.scoped.css';
import { getConnected, State, getPrivateKey, HistoryState } from '../store';
import { loadBagDataSaga } from 'src/store/sagas/loadBagData';

interface HorizontalProps {
  state: HistoryState,
  connected: string;
  registryUri: string;
  searchText: string;
  init: (a: { state: HistoryState; registryUri: string }) => void;
  setSearchText: (searchText: string) => void;
}

const HorizontalComponent: React.FC<HorizontalProps> = props => {
  const history = useHistory();

  const doFetch = () => {
    props.init({
      state: props.state,
      registryUri: props.registryUri,
    });
  };

  useEffect(() => {
    doFetch();
  }, []);

  const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    doFetch();
    event.detail.complete();
  };

  return (
    <React.Fragment>
      <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      { /*
      <div>
        <IonItem class="connectedAs">Connected as {props.connected}</IonItem>
      </div>
      */ }
      <div>
        <IonItem
          detail={false}
          no-padding
          lines="none"
          className="SearchBarContainer"
        >
          {props.connected === 'owner' && <IonButton
            className="AddButton with-border"
            icon-only
            slot="start"
            color="none"
            size="default"
            onClick={() => {
              history.push('/doc/upload/');
            }}
          >
            <span>upload</span>
          </IonButton>}
          {' '}
          <IonButton
            className="AddButton with-border"
            icon-only
            slot="start"
            color="none"
            size="default"
            onClick={() => {
              console.log(props.registryUri);
              props.init({
                state: props.state,
                registryUri: props.registryUri,
              })
            }}
          >
            <IonIcon icon={refreshOutline}></IonIcon>
            {' '}
            <span>refresh</span>
          </IonButton>
          <IonSearchbar
            color="none"
            value={props.searchText}
            onIonChange={e => props.setSearchText(e.detail.value!)}
          />
        </IonItem>
      </div>
    </React.Fragment>
  );
};

const Horizontal = connect(
  (state: HistoryState) => {
    return {
      state: state,
      connected: getConnected(state),
      registryUri: state.reducer.registryUri as string,
      searchText: state.reducer.searchText as string,
    };
  },
  (dispatch: Dispatch) => {
    return {
      init: async (a: { state: HistoryState; registryUri: string }) => {
      },

      setSearchText: (searchText: string) => {
        dispatch({
          type: 'SET_SEARCH_TEXT',
          payload: searchText,
        });
      },
    };
  }
)(HorizontalComponent);

export default Horizontal;
