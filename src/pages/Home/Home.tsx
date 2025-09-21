import { FC, useEffect, useState } from 'react';
import { useTexts } from '../../context/TextsContext';
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
} from '@ionic/react';
import GaIonButton from '../../components/GaIonButton';
import { helpCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import IncomeCard from '../../components/IncomeCard/IncomeCard';
import TeamCard from '../../components/TeamCard/TeamCard';
import { useLazyGetCurrentUserQuery } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';

import car from '../../assets/car.svg';

import './styles.scss';

const Home: FC = () => {
  const history = useHistory();
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
    <IonPage style={{ padding: 16, background: '#f6f8fa', overflow: 'auto' }}>
      <div>
        {/* Баланс */}
        <IncomeCard />

        <IonCard className='card-block osago-card'>
          <IonCardContent>
            <h3 className='card-section-title'>{t('section_policies')}</h3>
            <IonGrid>
              <IonRow>
                <IonCol size='6'>
                  <div className='stat-card'>
                    <p className='stat-title'>{t('policies_count_label')}</p>
                    <p className='stat-number'>{data.osagoCount}</p>
                    <p className='stat-info'>{t('stat_desc_1')}</p>
                  </div>
                </IonCol>
                <IonCol size='6'>
                  <div className='stat-card'>
                    <p className='stat-title'>{t('income_label')}</p>
                    <p className='stat-number'>{Math.floor(+data?.osagoIncome)}</p>
                    <p className='stat-info'>{t('stat_desc_2')}</p>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
            <GaIonButton
              className='primary-btn'
              expand='block'
              fill='solid'
              onClick={() => history.push('/a/referral')}
              gaEventName='home_referral'
            >
              <IonIcon slot='start' icon={car} />
              {t('ofo_title')}
            </GaIonButton>
            <p className='earn-percent'>{t('earn_10_percent')}</p>
          </IonCardContent>
        </IonCard>

        {/* Моя команда */}
        <TeamCard showButton={true} />

        <GaIonButton
          onClick={() => {
            window.open(
              'https://t.me/+ZMp1eTcT_4Y2MGEy',
              '_blank',
              'noopener,noreferrer'
            );
          }}
          className='outlined-btn'
          expand='block'
          fill='outline'
          gaEventName='home_help'
        >
          <IonIcon slot='start' icon={helpCircleOutline} />
          {t('btn_help')}
        </GaIonButton>
        <span style={{ fontSize: 12, color: '#7B7F88', marginTop: 8 }}>
          Все полисы ОСАГО выписывается ОАО «Бакай Иншуренс» на основе лицензии №03, номер бланка №0003 серии «ОС» от 05.02.24 г..
        </span>
      </div>
    </IonPage>
  );
};

export default Home;
