import React from 'react';
import { IonPage, IonButton } from '@ionic/react';
import { useTexts } from '../context/TextsContext';

const Identification: React.FC = () => {
  const { t } = useTexts();
  return (
    <IonPage style={{ overflow: 'auto', background: '#f6f8fa', padding: 16 }}>
      <div style={{ textAlign: 'center', marginTop: 60 }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Identification"
          style={{ width: 120, marginBottom: 24, borderRadius: 24 }}
        />
        <div style={{ fontWeight: 500, fontSize: 18, marginBottom: 18 }}>
          {t('id_required')}
        </div>
        <IonButton expand="block" color="primary" style={{ borderRadius: 12, fontWeight: 500, fontSize: 17 }}>
          {t('screen_identification')}
        </IonButton>
      </div>
    </IonPage>
  );
};

export default Identification;
