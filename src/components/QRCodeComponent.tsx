import React, {useState, useEffect} from 'react';
import {
  IonChip,
  IonLabel
  } from '@ionic/react';

import { QRCodeRenderersOptions, toCanvas } from "qrcode";

import './QRCodeComponent.css';

interface QRCodeComponentProps {
    url:string
}
const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ url }) => {
  const qrcodecanvas = React.useRef(null);

  useEffect(() => {
    //Update qr code
    if (url) {
        const opts = {
            errorCorrectionLevel: "H",
            width: 220,
            height: 220,
            margin: 1
          } as QRCodeRenderersOptions;
    
          toCanvas(
            qrcodecanvas.current,
            url,
            opts
          ).then(res => {
            console.info("QRCode created");
            console.info(res);
          });
    }
  }, [url]);
  
  return (
    <IonChip className="QRContainer">
        <canvas ref={qrcodecanvas} className="Image" />
        <IonLabel>Scan to join</IonLabel>
    </IonChip>
  );
};

export default QRCodeComponent;
