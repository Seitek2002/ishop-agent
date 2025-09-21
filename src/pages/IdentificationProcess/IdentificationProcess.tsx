import React from 'react';
import { IonPage, IonButton } from '@ionic/react';

import { useGetCurrentUserQuery } from '../../services/api';

import identificationProcessImg from '../../assets/identification-processing.svg';
import checkCircle from '../../assets/check-circle.svg';
import './styles.scss';

const IdentificationProcess: React.FC = () => {
  const { data: user } = useGetCurrentUserQuery();
  return (
    <IonPage className='identification-process-page'>
      <div className='identification-process-content'>
        {user?.identificationStatus === 'approved' ? (
          <>
            <img src={checkCircle} alt='check-circle' />
            <div className='identification-process-approved'>
              Вы идентифицированы
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h2 className='identification-process-title'>
              Идентификация в процессе
            </h2>
            <img
              src={identificationProcessImg}
              alt='Идентификация'
              className='identification-process-img'
            />
            <div className='identification-process-subtitle'>
              Подождите пока идет процесс
              <br />
              идентификации
            </div>
          </div>
        )}
        <IonButton
          expand='block'
          className='identification-process-btn'
          routerLink='/a/home'
        >
          На главную
        </IonButton>
      </div>
    </IonPage>
  );
};

export default IdentificationProcess;
