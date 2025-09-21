import { useEffect, useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { personAddOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import { useLazyGetCurrentUserQuery } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';
import { useTexts } from '../../context/TextsContext';

const TeamCard = ({ showButton }: { showButton?: boolean }) => {
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
      "averageAgentsIncome": "0"
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
    <IonCard
      className='card-block team-card'
      style={{ overflow: 'visible', zIndex: 1, marginTop: 2 }}
    >
      <IonCardContent>
        <h2 className='card-section-title'>{t('section_team')}</h2>
        <IonGrid>
          <IonRow>
            <IonCol size='6'>
              <div className='stat-card'>
                <p className='stat-title'>{t('agents_count_label')}</p>
                <p className='stat-number'>{data?.agentsCount}</p>
                <p className='stat-info'>{t('team_total_desc')}</p>
              </div>
            </IonCol>
            <IonCol size='6'>
              <div className='stat-card'>
                <p className='stat-title'>{t('income_agents_label')}</p>
                <p className='stat-number'>{Math.floor(+data?.agentsIncome)}</p>
                <p className='stat-info'>
                  {t('stat_desc_4')}
                </p>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
        {showButton && (
          <>
            <IonButton
              className='green-btn'
              fill='solid'
              expand='block'
              onClick={() => {
                history.push('/a/invite');
              }}
            >
              <IonIcon slot='start' icon={personAddOutline} />
              {t('btn_invite_agent')}
            </IonButton>
            <p className='earn-percent'>{t('bonus_5_percent')}</p>
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default TeamCard;
