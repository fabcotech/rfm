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
}

const BagItemComponent: React.FC<BagItemProps> = ({ bag, id }) => {
  const history = useHistory();
  return (
    <IonItem detail={false} button onClick={() => {
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
  undefined,
)(BagItemComponent);

export default BagItem;
