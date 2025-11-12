import { FC } from 'react';
import { useTexts } from '../../context/TextsContext';
import {
  IonIcon,
  IonPage,
} from '@ionic/react';
import GaIonButton from '../../components/GaIonButton';
import { helpCircleOutline } from 'ionicons/icons';
import IncomeCard from '../../components/IncomeCard/IncomeCard';
import TeamCard from '../../components/TeamCard/TeamCard';
import MyCard from '../../components/MyCard/MyCard';

import './styles.scss';

const Home: FC = () => {
  const { t } = useTexts();

  return (
    <IonPage style={{ padding: 16, background: '#f6f8fa', overflow: 'auto' }}>
      <div>
        {/* Баланс */}
        <IncomeCard />

        <MyCard showButton={true} />

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
        {/* <span style={{ fontSize: 12, color: '#7B7F88', marginTop: 8 }}>
          Все полисы ОСАГО выписывается ОАО «Бакай Иншуренс» на основе лицензии
          №03, номер бланка №0003 серии «ОС» от 05.02.24 г..
        </span> */}
      </div>
    </IonPage>
  );
};

export default Home;
