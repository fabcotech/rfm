import React from 'react';
import {
  IonIcon,
  IonItem,
  IonLabel,
  } from '@ionic/react';
import { Bag } from '../store';
import './BagItem.css';

import { document } from 'ionicons/icons';

interface BagItemProps {
  bag: Bag;
  id: string;
}

const BagItem: React.FC<BagItemProps> = ({ bag, id }) => {
  return (
    <IonItem detail={false}>
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
