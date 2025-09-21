import React, { useMemo, useState } from 'react';
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonIcon,
  IonModal,
  IonPage,
  useIonRouter,
} from '@ionic/react';
import {
  chevronForwardOutline,
  createOutline,
  helpCircleOutline,
  logOutOutline,
} from 'ionicons/icons';

import { useGetCurrentUserQuery } from '../../services/api';
import { useTexts } from '../../context/TextsContext';

import avatar from '../../assets/avatar-default.svg';
import helpBuoy from '../../assets/helpBuoyFilled.svg';
import helpReferral from '../../assets/helpReferral.svg';
import helpQuestion from '../../assets/helpQuestionFilled.svg';

import './styles.scss';

const Profile: React.FC = () => {
  const navigate = useIonRouter();
  const { t } = useTexts();

  const { data: user } = useGetCurrentUserQuery();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const editClick = () => {
    navigate.push('/a/profile/edit');
  };

  const identificationClick = () => {
    if (user?.identificationStatus === 'not_submitted') {
      navigate.push('/a/profile/identification');
    } else {
      window.open(
        'https://t.me/+ZMp1eTcT_4Y2MGEy',
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  const fullName = useMemo(() => {
    return user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName} ${user.middleName}`
      : null;
  }, [user?.firstName, user?.lastName, user?.middleName]);

  const handleLogout = () => {
    localStorage.clear();
    navigate.push('/a/auth', 'root', 'replace');
  };

  return (
    <IonPage className='profile-page'>
      <IonModal
        isOpen={showLogoutModal}
        onDidDismiss={() => setShowLogoutModal(false)}
        breakpoints={[0, 0.4, 0.7, 1]}
        initialBreakpoint={0.4}
      >
        <IonContent className='ion-padding' style={{ textAlign: 'center' }}>
          <h2 style={{ marginTop: 32 }}>Выйти из профиля?</h2>
          <p style={{ color: '#888', marginBottom: 32 }}>
            Вы действительно хотите выйти из профиля?
          </p>
          <IonButton
            expand='block'
            color='danger'
            onClick={() => {
              setShowLogoutModal(false);
              handleLogout();
            }}
            style={{ marginBottom: 12 }}
          >
            Выйти
          </IonButton>
          <IonButton
            expand='block'
            fill='outline'
            onClick={() => setShowLogoutModal(false)}
          >
            Отмена
          </IonButton>
        </IonContent>
      </IonModal>
      <div>
        <div className='profile-header'>
          <IonAvatar className='profile-avatar'>
            <img src={user?.passportSelfie ?? avatar} alt='Avatar' />
            <IonIcon
              onClick={editClick}
              className='profile-edit'
              icon={createOutline}
            ></IonIcon>
            <IonIcon
              icon={logOutOutline}
              className='profile-logout'
              onClick={() => setShowLogoutModal(true)}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                fontSize: 24,
                color: '#e53935',
                cursor: 'pointer',
                background: '#fff',
                borderRadius: '50%',
                padding: 4,
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              }}
              title='Выйти'
            />
          </IonAvatar>
          <span className='profile-name'>{fullName || user?.phoneNumber}</span>
          {fullName && (
            <span className='profile-subname' style={{ marginBottom: 8 }}>
              {user?.phoneNumber}
            </span>
          )}
          <span className={`profile-status ${user?.identificationStatus}`}>
            {user?.identificationStatus === 'approved' &&
              t('user_status_identified')}
            {user?.identificationStatus === 'not_submitted' &&
              t('user_status_not_identified')}
            {user?.identificationStatus === 'pending' && 'На рассмотрении'}
          </span>
        </div>
        <div className='profile-actions'>
          <div
            className='profile-action'
            onClick={() => navigate.push('/a/instruction')}
          >
            <div className='profile-action__icon profile-action__icon--blue'>
              <IonIcon icon={helpBuoy} />
            </div>
            <div className='profile-action__content'>
              <div className='profile-action__title profile-action__title--blue'>
                {t('insurance_case_title')}
              </div>
              <div className='profile-action__subtitle'>
                {t('accident_instructions')}
              </div>
            </div>
            <IonIcon
              icon={chevronForwardOutline}
              className='profile-action__arrow'
            />
          </div>
          <a
            className='profile-action profile-action--referral'
            href='/a/ПУБЛИЧНАЯ ОФЕРТА для субагентов.pdf'
            target='_blank'
            rel='noopener noreferrer'
          >
            <div className='profile-action__icon profile-action__icon--blue'>
              <IonIcon icon={helpReferral} />
            </div>
            <div className='profile-action__content'>
              <div className='profile-action__title profile-action__title--blue'>
                Правила реферальной акции
              </div>
              <div className='profile-action__subtitle'>
                Услов. участии в реферальной акции
              </div>
            </div>
            <IonIcon
              icon={chevronForwardOutline}
              className='profile-action__arrow'
            />
          </a>
          <div
            className='profile-action'
            onClick={() => navigate.push('/a/my-faq')}
          >
            <div className='profile-action__icon profile-action__icon--gray'>
              <IonIcon icon={helpQuestion} />
            </div>
            <div className='profile-action__content'>
              <div className='profile-action__title'>{t('faq_prompt')}</div>
              <div className='profile-action__subtitle'>{t('faq_title')}</div>
            </div>
            <IonIcon
              icon={chevronForwardOutline}
              className='profile-action__arrow'
            />
          </div>
          <IonButton
            onClick={identificationClick}
            className='outlined-btn'
            expand='block'
            fill='outline'
          >
            {(user?.identificationStatus === 'approved' ||
              user?.identificationStatus === 'pending') && (
              <IonIcon slot='start' icon={helpCircleOutline} />
            )}
            {user?.identificationStatus === 'not_submitted'
              ? t('verify_button')
              : t('btn_help')}
          </IonButton>
          <div className='profile-contacts'>
            <h2>{t('contacts_title')}</h2>
            <p>{t('contacts_address')}</p>
            <IonButton
              href='tel:+996777394080'
              className='outlined-btn'
              expand='block'
              fill='outline'
            >
              {t('call_button')}
            </IonButton>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Profile;
