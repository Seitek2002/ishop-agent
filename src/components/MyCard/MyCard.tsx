import {
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
} from '@ionic/react';
import { FC, useEffect, useState } from 'react';
import GaIonButton from '../GaIonButton';
import { useHistory } from 'react-router';
import { useTexts } from '../../context/TextsContext';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';
import { useLazyGetCurrentUserQuery } from '../../services/api';

import car from '../../assets/car.svg';

interface IProps {
  showButton?: boolean;
}

const MyCard: FC<IProps> = ({ showButton }) => {
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
          "identificationStatus": "not_submitted",
          "averageAgentsIncome": "0",
          "salesCount": 0,
          "salesIncome": 0
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
    <IonCard className='card-block osago-card'>
      <IonCardContent>
        <h3 className='card-section-title'>{t('section_policies')}</h3>
        <IonGrid>
          <IonRow>
            <IonCol size='6'>
              <div className='stat-card'>
                <p className='stat-title'>{t('policies_count_label')}</p>
                <p className='stat-number'>{data.salesCount || 0}</p>
                <p className='stat-info'>{t('stat_desc_1')}</p>
              </div>
            </IonCol>
            <IonCol size='6'>
              <div className='stat-card'>
                <p className='stat-title'>{t('income_label')}</p>
                <p className='stat-number'>
                  {Math.floor(+data?.salesIncome || 0)}
                </p>
                <p className='stat-info'>{t('stat_desc_2')}</p>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
        {showButton && (
          <>
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
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default MyCard;
