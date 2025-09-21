import React, { useEffect, useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonPage,
  IonRow,
} from '@ionic/react';
import GaIonButton from '../../components/GaIonButton';
import { searchOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useLazyGetPoliciesQuery, Policy } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';
import car from '../../assets/car.svg';
import './style.scss';
import { useTexts } from '../../context/TextsContext';

const Osago: React.FC = () => {
  const history = useHistory();
  const { t } = useTexts();

  // Паттерн localData + data + getPolicies + handleFetch + useEffect
  const localData = localStorage.getItem('policies') || '[]';

  const [data, setData] = useState<Policy[]>(JSON.parse(localData));
  const usersInfo = JSON.parse(
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
      }`
  );
  const [getPolicies] = useLazyGetPoliciesQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const handleFetch = async () => {
    const res = await getPolicies().unwrap();
    CompareLocaldata({
      oldData: localData,
      newData: res,
      localKey: 'policies',
      setState: (data: any) => setData(Array.isArray(data) ? data : []),
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

        <IonCard className='card-block osago-card'>
          <IonCardContent>
            <h3 className='card-section-title'>{t('section_policies')}</h3>
            <IonGrid>
              <IonRow>
                <IonCol size='6'>
                  <div className='stat-card'>
                    <p className='stat-title'>{t('policies_count_label')}</p>
                    <p className='stat-number'>{usersInfo.osagoCount}</p>
                    <p className='stat-info'>{t('stat_desc_1')}</p>
                  </div>
                </IonCol>
                <IonCol size='6'>
                  <div className='stat-card'>
                    <p className='stat-title'>{t('income_label')}</p>
                    <p className='stat-number'>{+usersInfo?.agentsIncome}</p>
                    {/* <p className='stat-info'>В среднем зарабатывают {+usersInfo.averageAgentsIncome} сом</p> */}
                    <p className='stat-info'>{t('stat_desc_2')}</p>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

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
