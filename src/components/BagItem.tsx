import { connect } from 'react-redux';
import React from 'react';
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonButton,
} from '@ionic/react';

import { useHistory } from 'react-router';
import { Bag, Document } from '../store';
import './BagItem.scoped.css';

import { document as documentIcon, trash, create } from 'ionicons/icons';
import { bagIdFromAddress } from '../utils/bagIdFromAddress';

interface BagItemProps {
  bag: Bag;
  registryUri: string;
  id: string;
  awaitsSignature: boolean;
  completed: boolean;
  onlyCompleted: boolean;
  document: Document;
}

const BagItemComponent: React.FC<BagItemProps> = ({
  onlyCompleted,
  id,
  awaitsSignature,
  completed,
  document
}) => {
  const history = useHistory();
  return (
    <IonItemSliding>
      <IonItemOptions side="end">
        <IonItemOption
          color="secondary"
          onClick={() => console.log('favorite clicked')}
        >
          <IonIcon icon={create} size="large" />
        </IonItemOption>
        <IonItemOption
          color="danger"
          onClick={() => console.log('share clicked')}
        >
          <IonIcon icon={trash} size="large" />
        </IonItemOption>
      </IonItemOptions>
      <IonItem
        className={`${(!onlyCompleted && document.parent) ? 'with-parent' : ''} ${completed ? 'success' : 'secondary'}`}
        detail={false}
        button
        onClick={() => {
          history.push('/doc/show/' + id);
        }}
      >
        <div className="IconContainer">
          <IonIcon icon={documentIcon} color={completed ? 'success' : 'secondary'} size="large" />
        </div>
        <IonLabel className="ion-text-wrap">
          <h2>{bagIdFromAddress(id)}</h2>
        </IonLabel>
        {awaitsSignature && (
          <IonButton color="secondary" size="small">
            Needs signature
          </IonButton>
        )}
      </IonItem>
    </IonItemSliding>
  );
};

const BagItem = connect(
  undefined,
  undefined
)(BagItemComponent);

export default BagItem;
