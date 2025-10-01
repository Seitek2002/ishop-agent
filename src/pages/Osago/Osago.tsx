import React, { useEffect, useState } from 'react';
import { IonIcon, IonInput, IonPage } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import GaIonButton from '../../components/GaIonButton';
import MyCard from '../../components/MyCard/MyCard';
import { useTexts } from '../../context/TextsContext';

import { useLazyGetPoliciesQuery, Policy } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';

import car from '../../assets/car.svg';
import './style.scss';

const Osago: React.FC = () => {
  const history = useHistory();
  const { t } = useTexts();

  // Паттерн localData + data + getPolicies + handleFetch + useEffect
  const localData = localStorage.getItem('policies') || '[]';

  const [data, setData] = useState<Policy[]>(JSON.parse(localData));
  const [getPolicies] = useLazyGetPoliciesQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const handleFetch = async () => {
    const res = await getPolicies().unwrap();
    CompareLocaldata({
      oldData: localData,
      newData: res,
      localKey: 'policies',
      setState: (data) => setData(Array.isArray(data) ? data : []),
    });
  };

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line
  }, []);

  // Фильтрация по поиску
  const filtered = data.filter((policy) => {
    const term = searchTerm.toLowerCase();
    return policy.fullName.toLowerCase().includes(term);
  });

  return (
    <IonPage className='osago-page'>
      <div>
        {/* Поиск */}
        <div className='search-bar'>
          <IonIcon icon={searchOutline} className='search-icon' />
          <IonInput
            placeholder={t('search_section')}
            className='search-input'
            value={searchTerm}
            onIonInput={(e) =>
              setSearchTerm((e.detail.value || '').toLowerCase())
            }
          />
        </div>

        <MyCard />

        {/* Список полисов */}
        {filtered.map((policy) => (
          <div className='policy-card' key={policy.id}>
            <div className='policy-name'>{policy.fullName}</div>
            <div className='policy-number'>№{policy.id}</div>
            <div className='policy-info'>
              <span className='label'>{t('vehicle_info').split(':')[0]}:</span>
              <span className='until'> {policy.vehicle || '—'}</span>
            </div>
            <div className='policy-info'>
              <span className='label'>{t('issue_date').split(':')[0]}:</span>
              <span className='until'> {policy.startDate}</span>
            </div>
            <div className='policy-status'>
              <span className='active'>{t('active_until').split(':')[0]}</span>
              <span className='until'>
                {' '}
                {t('active_until').includes(':')
                  ? t('active_until').split(':')[1]
                  : 'до'}{' '}
                {policy.endDate}
              </span>
            </div>
            <div className='policy-buttons'>
              <GaIonButton
                expand='block'
                fill='outline'
                color='primary'
                className='policy-btn'
                style={{ padding: 0 }}
                href={policy.policyPdfUrl}
                target='_blank'
                rel='noopener noreferrer'
                gaEventName='osago_download_pdf'
              >
                {t('btn_download')}
              </GaIonButton>
            </div>
          </div>
        ))}

        {/* Кнопка оформить ОСАГО */}
        <div className='bottom-button-wrapper'>
          <GaIonButton
            expand='block'
            className='primary-btn'
            onClick={() => history.push('/a/referral')}
            gaEventName='osago_referral'
          >
            <img src={car} alt={t('ofo_title')} />
            {t('ofo_title')}
          </GaIonButton>

          <div className='earn-percent'>{t('earn_10_percent')}</div>
        </div>
      </div>
    </IonPage>
  );
};

export default Osago;
