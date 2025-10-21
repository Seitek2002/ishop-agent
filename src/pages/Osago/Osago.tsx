import React, { useEffect, useState } from 'react';
import { IonIcon, IonInput, IonPage } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import GaIonButton from '../../components/GaIonButton';
// import MyCard from '../../components/MyCard/MyCard';
import { useTexts } from '../../context/TextsContext';

import {
  OrganizationListItem,
  useLazyGetOrganizationsQuery,
} from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';

import car from '../../assets/car.svg';
import './style.scss';

const Osago: React.FC = () => {
  const history = useHistory();
  const { t } = useTexts();

  const localData = localStorage.getItem('policies') || '[]';

  const [data, setData] = useState<OrganizationListItem[]>(
    JSON.parse(localData)
  );
  const [getPolicies] = useLazyGetOrganizationsQuery();
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
  const filtered = data.filter((organization) => {
    const term = searchTerm.toLowerCase();
    return organization.companyName.includes(term);
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

        {/* <MyCard /> */}

        {/* Список полисов */}
        {filtered.map((organization) => (
          <div className='organization-card' key={organization.companyName}>
            <div className='organization-header'>
              <img src={organization.logo || ''} alt='' />
              <span className='organization-name'>
                {organization.companyName}
              </span>
            </div>
            <p className='organization-description'>
              {organization.description}
            </p>
            <div className='organization-earns-title'>Вознаграждения:</div>
            <div className='organization-earns'>
              <div className='organization-earn'>
                <div className='organization-percent'>15%</div>
                <div>от продаж</div>
              </div>
              <div className='organization-earn'>
                <div className='organization-percent'>15%</div>
                <div>от друзей</div>
              </div>
            </div>
            <div className='organization-buttons'>
              <GaIonButton
                expand='block'
                fill='outline'
                color='primary'
                className='organization-btn'
                style={{ padding: 0 }}
                onClick={() => history.push('/a/referral')}
              >
                {t('btn_download')}
              </GaIonButton>
              <GaIonButton
                expand='block'
                fill='outline'
                color='primary'
                className='organization-btn'
                style={{ padding: 0 }}
                href={'ishop.kg/' + organization.slug}
                target='_blank'
                rel='noopener noreferrer'
                gaEventName='osago_download_pdf'
              >
                {t('read_more')}
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
