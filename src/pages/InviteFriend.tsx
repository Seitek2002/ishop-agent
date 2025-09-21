import React from 'react';
import { IonButton, IonIcon, IonPage } from '@ionic/react';
import { personAddOutline, informationCircleOutline } from 'ionicons/icons';
import inviteLogo from '../assets//onboarding/inviteLogo.png';

import { useLazyGetCurrentUserQuery } from '../services/api';
import { useEffect, useState } from 'react';
import { CompareLocaldata } from '../helpers/CompareLocaldata';
import { useTexts } from '../context/TextsContext';

const InviteFriend: React.FC = () => {
  const { t } = useTexts();
  const localData =
    localStorage.getItem('usersInfo') ||
    `{
      "id": 0,
      "firstName": "",
      "lastName": "",
      "middleName": "",
      "phoneNumber": "+996",
      "balance": "0",
      "totalIncome": "0",
      "osagoIncome": "0",
      "agentsIncome": "0",
      "osagoCount": 0,
      "agentsCount": 0,
      "referralLink": "string",
      "identificationStatus": "not_submitted"
    }`;

  const [data, setData] = useState(JSON.parse(localData));
  const [getUserInfo] = useLazyGetCurrentUserQuery();

  const handleFetch = async () => {
    const res = await getUserInfo().unwrap();
    CompareLocaldata({
      oldData: localData,
      newData: res,
      localKey: 'usersInfo',
      setState: setData,
    });
  };

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line
  }, []);

  return (
    <IonPage
      style={{
        padding: 16,
        background: '#f6f8fa',
        overflow: 'auto',
        textAlign: 'center',
      }}
    >
      <div>
        <img
          src={inviteLogo}
          alt='Invite'
          style={{
            width: '100%',
            margin: '0 auto 18px auto',
            display: 'block',
          }}
        />
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 10 }}>
          {t('promo_title_2')}
        </div>
        <div style={{ color: '#1abc9c', fontSize: 16, marginBottom: 22 }}>
          {t('bonus_5_percent')}
        </div>
        <IonButton
          expand='block'
          className='primary-btn'
          style={{
            fontWeight: 500,
            borderRadius: 12,
            marginBottom: 18,
            fontSize: 17,
          }}
          onClick={() => {
            const link = data?.referralLink || '';
            if (navigator.share) {
              navigator.share({
                title: t('add_to_group_title'),
                text: t('add_to_group_text'),
                url: link,
              });
            } else {
              alert(link ? link : t('referral_code'));
            }
          }}
        >
          <IonIcon icon={personAddOutline} slot='start' />
          {t('btn_invite_friend')}
        </IonButton>
        <div className='referral-hint'>
          <IonIcon
            icon={informationCircleOutline}
            style={{
              color: '#3880ff',
              fontSize: 20,
              marginTop: 2,
              width: 24,
              height: 24,
            }}
          />
          <span style={{ fontSize: 12, width: '80%' }}>
            {t('referral_instructions')}
          </span>
        </div>
      </div>
    </IonPage>
  );
};

export default InviteFriend;
