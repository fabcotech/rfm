import React, { useEffect} from 'react';
import {
  IonChip,
  IonLabel
  } from '@ionic/react';

import { QRCodeRenderersOptions, toCanvas } from "qrcode";

import './QRCodeComponent.scoped.css';

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
            width: 100,
            height: 100,
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
    <IonChip className="QRContainer" color="tertiary">
        <canvas ref={qrcodecanvas} className="Image" />
        <IonLabel color="light">Scan to view</IonLabel>
    </IonChip>
  );
};

export default QRCodeComponent;
