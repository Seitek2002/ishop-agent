import React, { FC, useEffect, useState } from 'react';
import { IonButton, IonPage } from '@ionic/react';
import referralLogo from '../../assets/onboarding/bakaiIshnersu.png';
import { useLazyGetCurrentUserQuery } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';

import car from '../../assets/car.svg';
import share from '../../assets/share.svg';
import warning from '../../assets/warning.svg';

import './style.scss';
import { useTexts } from '../../context/TextsContext';

const ReferralInfo: FC = () => {
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
  }, []);

  return (
    <IonPage className='referral-page'>
      <div className='referral-card'>
        <img
          src={referralLogo}
          alt={t('company_name')}
          className='referral-logo'
        />
        <div className='referral-description'>{t('company_description')}</div>
        <div className='referral-title'>{t('referral_title')}</div>
        <div className='referral-code'>{data?.id}</div>
        <p className='earn-percent-2' style={{ fontSize: '14px' }}>
          {t('earn_10_percent')}
        </p>

        <IonButton
          expand='block'
          className='primary-btn'
          onClick={() => {
            if (data?.authReferralLink) {
              window.location.href = data.authReferralLink;
            }
          }}
        >
          <img src={car} alt='car' />
          {t('btn_issue_other')}
        </IonButton>

        <IonButton
          expand='block'
          fill='outline'
          className='referral-btn'
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: t('share_osago_link_title'),
                text: t('share_osago_link_text'),
                url: data.authReferralLink,
              });
            } else {
              alert('Web Share API не поддерживается на этом устройстве');
            }
          }}
        >
          <img src={share} alt='share' />
          {t('btn_share')}
        </IonButton>

        <div className='referral-hint'>
          <img src={warning} alt='warning' />
          <span>{t('referral_instructions')}</span>
        </div>

        <div className='referral-hint'>
          <img src={warning} alt='warning' />
          <span style={{ fontSize: 12, color: '#7B7F88' }}>
            Все полисы ОСАГО выписывается ОАО «Бакай Иншуренс» на основе
            лицензии №03, номер бланка №0003 серии «ОС» от 05.02.24 г..
          </span>
        </div>
      </div>
    </IonPage>
  );
};

export default ReferralInfo;
