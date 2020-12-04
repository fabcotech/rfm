import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import {
  IonIcon,
  IonItem,
  IonLabel,
  } from '@ionic/react';

import { useHistory } from 'react-router';
import { Bag } from '../store';
import './BagItem.css';

import { document } from 'ionicons/icons';

interface BagItemProps {
  bag: Bag;
  id: string;
  loadBag: (bagId: string) => void;
}

const BagItemComponent: React.FC<BagItemProps> = ({ bag, loadBag, id }) => {
  const history = useHistory();
  return (
    <IonItem detail={false} button onClick={() => {
      loadBag(id)
      console.log("/doc/show/" + id)
      history.push("/doc/show/" + id);
    }}>
      <div className="IconContainer">
        <IonIcon icon={document} size="large"/>
      </div>
      <IonLabel className="ion-text-wrap">
        <h2>
          {id}
        </h2>
      </IonLabel>
    </IonItem>
  );
};

const BagItem = connect(
  undefined,
  (dispatch: Dispatch) => {
    return {
      loadBag: (bagId: string) => {
        dispatch({
          type: 'LOAD_BAG_DATA',
          payload: {
            bagId: bagId,
          }
        })
      }
    }
  }
)(BagItemComponent);

export default BagItem;
