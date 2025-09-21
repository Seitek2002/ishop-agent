import { useMemo } from 'react';
import { IonPage, IonButton } from '@ionic/react';
import { useGetCurrentUserQuery } from '../../services/api';

import identificationImg from '../../assets/identification-need.svg';

import './styles.scss';

const WithdrawIdentification = () => {
  const { data: user } = useGetCurrentUserQuery();

  const redirectUrl = useMemo(() => {
    if (user?.identificationStatus === 'pending') {
      return '/a/profile/identification/process';
    }
    return '/a/profile/identification';
  }, [user?.identificationStatus]);

  return (
    <IonPage className='withdraw-identification-page'>
      <div className='withdraw-identification-content'>
        <img
          src={identificationImg}
          alt='Требуется идентификация'
          className='withdraw-identification-img'
        />
        <div className='withdraw-identification-text'>
          Требуется идентификация для вывода денег
        </div>
        <IonButton
          expand='block'
          className='withdraw-identification-btn'
          routerLink={redirectUrl}
        >
          Идентификация
        </IonButton>
      </div>
    </IonPage>
  );
};

export default WithdrawIdentification;
