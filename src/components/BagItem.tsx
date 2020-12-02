import React from 'react';
import {
  IonItem,
  IonLabel,
  } from '@ionic/react';
import { Bag } from '../store';
import './BagItem.css';

interface BagItemProps {
  bag: Bag;
  id: string;
}

const BagItem: React.FC<BagItemProps> = ({ bag, id }) => {
  return (
    <IonItem detail={false}>
      <div slot="start" className="dot dot-unread"></div>
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
