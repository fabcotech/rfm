import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { HistoryState } from '../../store';

import {
  IonLabel,
  IonButton,
  IonSlide,
  IonGrid,
  IonRow,
  IonCol,
  IonReorderGroup,
  IonItem,
  IonReorder
} from '@ionic/react';
import './IdentityScreen.scoped.css';
import './VerifyIdentityScreen.scoped.css';


interface VerifySeedScreenComponentProps {
  localPath?: string;
  currentPath?: string;
  seedHash: Uint8Array;
  seedWords: Array<string>;
  readOnlyUrl: string;
  searchText: string;
}
const VerifySeedScreenComponent: React.FC<VerifySeedScreenComponentProps> = (props) => {
  useEffect(() => {
    console.info("GOT SEED");
    console.info(props.seedWords);
    const reorderGroup = document.getElementById('reorder');
    reorderGroup?.addEventListener('ionItemReorder', (event) => {
      //@ts-ignore
      event.detail.complete(true);
    });
  }, []);

  const seed = ["saddle", "toast", "clip", "surround", "dash", "young", "pink", "digital", "trick", "fever", "black", "mixture"];


  return (
    <IonSlide>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonLabel>Please put your seed words in the correct order:</IonLabel>
            <IonLabel>{props.searchText}</IonLabel>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonReorderGroup class="Reorder" disabled={false} id="reorder">
            {props.seedWords?.map(function (word, index) {
              return (
                <IonReorder key={index}>
                  <IonItem class="WordContainer" no-margin>
                    <IonLabel class="Word">{word}</IonLabel>
                  </IonItem>
                </IonReorder>
              )
            })}
          </IonReorderGroup>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton color="none" className="ActionButton">Next</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonSlide>
  )
};

const VerifySeedScreen = connect(
  (state: HistoryState) => {
    return {
      //seedHash: state.seedHash as Uint8Array,
      //seedWords: state.seedWords as Array<string>,
      readOnlyUrl: state.reducer.readOnlyUrl,
      searchText: state.reducer.searchText
    }
  },
  (dispatch: Dispatch) => { }
)(VerifySeedScreenComponent);

export default VerifySeedScreen;
