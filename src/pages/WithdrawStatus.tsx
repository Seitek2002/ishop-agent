import React from 'react';
import { IonPage, IonButton, IonIcon } from '@ionic/react';
import { timeOutline } from 'ionicons/icons';
import { useTexts } from '../context/TextsContext';

const WithdrawStatus: React.FC = () => {
  const { t } = useTexts();
  // Примерные данные, в реальном проекте должны приходить с сервера/props
  const transactionNumber = '№3248';
  const requisite = '+996555112233 - MBANK';
  const amount = '1000 сом';
  const status = 'На рассмотрении';
  const comment = t('withdraw_section');

  return (
    <IonPage style={{ overflow: 'auto', background: '#f6f8fa', padding: 16 }}>
      <div>
        <div style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 2px 8px rgba(56,128,255,0.08)',
          padding: '20px 18px 18px 18px',
          marginBottom: 18,
          textAlign: 'center'
        }}>
          <IonIcon icon={timeOutline} style={{ fontSize: 38, color: '#ff9800', marginBottom: 8 }} />
          <div style={{ color: '#222', fontWeight: 500, marginBottom: 6 }}>
            {t('withdraw_desc_1')}
          </div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>{transactionNumber}</div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>{t('withdraw_detail_1')}: {requisite}</div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 2 }}>{t('withdraw_detail_2')}: {amount}</div>
          <div style={{ color: '#ff9800', fontWeight: 500, marginBottom: 2 }}>{t('withdraw_detail_3')}: {status}</div>
          <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>{t('withdraw_detail_4')}: {comment}</div>
        </div>
        <IonButton expand="block" color="primary" style={{ borderRadius: 12, fontWeight: 500, fontSize: 17 }}>
          {/* Нет ключа для этой кнопки, оставить как есть или добавить */}
          Вернуться на главную
        </IonButton>
      </div>
    </IonPage>
  );
};

export default WithdrawStatus;
