import { connect } from 'react-redux';
import React from 'react';
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption
  } from '@ionic/react';

import { useHistory } from 'react-router';
import { Bag } from '../store';
import './BagItem.scoped.css';

import { document as documentIcon, trash, create } from 'ionicons/icons';

interface BagItemProps {
  bag: Bag;
  registryUri: string;
  id: string;
}

const BagItemComponent: React.FC<BagItemProps> = ({ bag, registryUri, id }) => {
  const history = useHistory();
  return (
    <IonItemSliding>
      <IonItemOptions side="end">
        <IonItemOption color="secondary" onClick={() => console.log('favorite clicked')}><IonIcon icon={create} size="large"></IonIcon></IonItemOption>
        <IonItemOption color="danger" onClick={() => console.log('share clicked')}><IonIcon icon={trash} size="large"></IonIcon></IonItemOption>
      </IonItemOptions>
      <IonItem detail={false} button onClick={() => {
        history.push("/doc/show/" + registryUri + "/" + id);
      }}>
        <div className="IconContainer">
          <IonIcon icon={documentIcon} size="large"/>
        </div>
        <IonLabel className="ion-text-wrap">
          <h2>
            {id}
          </h2>
        </IonLabel>
      </IonItem>
    </IonItemSliding>
  );
};

const BagItem = connect(
  undefined,
  undefined,
)(BagItemComponent);

export default BagItem;
