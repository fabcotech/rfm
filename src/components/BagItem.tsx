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

const BagItem: React.FC<BagItemProps> = ({ bag, id }) => {
  const history = useHistory();
  return (
    <IonItem detail={false} button onClick={() => {
      history.push("/doc/" + id);
    }}>
      <div className="IconContainer">
        <IonIcon icon={document} size="large"/>
      </div>
      <IonLabel className="ion-text-wrap">
        <h2>
          {id}
        </h2>
        <h4>
          quantity {bag.quantity}
        </h4>
        <h4>
          price {bag.price}
        </h4>
      </IonLabel>
    </IonItem>
  );
};

export default BagItem;
