import { FC, useEffect, useState } from 'react';
import { IonButton, IonPage, IonToast } from '@ionic/react';

import {
  OrganizationListItem,
  useLazyGetCurrentUserQuery,
} from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';
import { useTexts } from '../../context/TextsContext';

import car from '../../assets/car.svg';
import share from '../../assets/share.svg';
import warning from '../../assets/warning.svg';

import './style.scss';
import OrganizationCard from '../../components/OrganizationCard/OrganizationCard';

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
  const localOrganization: OrganizationListItem[] = JSON.parse(
    localStorage.getItem('policies') || '[]'
  );

  const [data, setData] = useState(JSON.parse(localData));
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://ishop.kg/${
    localStorage.getItem('referral') || ''
  }?ref=${data?.id ?? ''}`;

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

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <IonPage className='referral-page'>
      <div className='referral-card'>
        {/* <img
          src={referralLogo}
          alt={t('company_name')}
          className='referral-logo'
        />
        <div className='referral-description'>{t('company_description')}</div>
        <div className='referral-title'>{t('referral_title')}</div> */}
        <div style={{ textAlign: 'left' }}>
          <OrganizationCard
            buttons={false}
            organization={
              localOrganization.filter(
                (item) => item.slug === localStorage.getItem('referral')
              )[0]
            }
          />
        </div>

        <div
          className='referral-code'
          style={{
            fontSize: '20px',
            border: '1px solid #000',
            padding: '10px',
            cursor: 'pointer',
            userSelect: 'text',
            marginBottom: 12,
            borderRadius: '45px',
            backgroundColor: '#854C9D10',
            color: '#6495ED',
          }}
          role='button'
          tabIndex={0}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(shareUrl);
              setCopied(true);
            } catch {
              // Fallback: create temporary textarea
              try {
                const ta = document.createElement('textarea');
                ta.value = shareUrl;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                setCopied(true);
              } catch (e) {
                console.warn('Fallback copy failed', e);
              }
            }
          }}
          onKeyDown={async (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              try {
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
              } catch (e) {
                console.warn('Clipboard write failed', e);
              }
            }
          }}
        >
          {shareUrl}
        </div>
        <p className='earn-percent-2' style={{ fontSize: '14px' }}>
          {t('earn_10_percent')}
        </p>

        <IonButton
          expand='block'
          className='primary-btn'
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: t('share_osago_link_title'),
                text: t('share_osago_link_text'),
                url: localStorage.getItem('referral') + '?ref=' + data.id,
              });
            } else {
              alert('Web Share API не поддерживается на этом устройстве');
            }
          }}
        >
          <svg
            fill='#fff'
            viewBox='-2 -2 24 24'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='xMinYMin'
            className='jam jam-share-alt'
            stroke='#fff'
            width={20}
            style={{
              marginRight: '10px'
            }}
          >
            <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
            <g
              id='SVGRepo_tracerCarrier'
              stroke-linecap='round'
              stroke-linejoin='round'
            ></g>
            <g id='SVGRepo_iconCarrier'>
              <path d='M16 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7.928 9.24a4.02 4.02 0 0 1-.026 1.644l5.04 2.537a4 4 0 1 1-.867 1.803l-5.09-2.562a4 4 0 1 1 .083-5.228l5.036-2.522a4 4 0 1 1 .929 1.772L7.928 9.24zM4 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'></path>
            </g>
          </svg>
          {t('btn_share')}
        </IonButton>

        <IonButton
          expand='block'
          className='referral-btn'
          fill='outline'
          onClick={() => {
            window.location.href =
              'https://ishop.kg/' +
              localStorage.getItem('referral') +
              '?ref=' +
              data.id;
          }}
        >
          <img src={car} alt='car' />
          {t('btn_issue_other')}
        </IonButton>

        <div className='referral-hint'>
          <img src={warning} alt='warning' />
          <span>{t('referral_instructions')}</span>
        </div>
      </div>
      <IonToast
        isOpen={copied}
        message='Ссылка скопирована'
        duration={1500}
        position='top'
        onDidDismiss={() => setCopied(false)}
      />
    </IonPage>
  );
};

export default ReferralInfo;
