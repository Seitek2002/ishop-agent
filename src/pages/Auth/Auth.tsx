import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent,
  IonItem,
  IonCheckbox,
  IonText,
  IonInput,
  IonPage,
} from '@ionic/react';
import GaIonButton from '../../components/GaIonButton';
import {
  useSendSmsMutation,
  useUsersNameRetrieveQuery,
} from '../../services/api';
import { skipToken } from '@reduxjs/toolkit/query';
import { useHistory, useLocation } from 'react-router-dom';
import './style.scss';
import { useTexts } from '../../context/TextsContext';

type ErrorWithData = { data?: { error?: string; secondsLeft?: number } };

function isErrorWithData(e: unknown): e is ErrorWithData {
  return (
    typeof e === 'object' &&
    e !== null &&
    'data' in e &&
    typeof (e as { data?: unknown }).data === 'object' &&
    (e as { data?: unknown }).data !== null
  );
}

const Auth: React.FC = () => {
  const { pathname } = useLocation();
  const { t, getFile } = useTexts();
  const history = useHistory();

  // Ссылки на документы из page-text через useTexts
  // t('agree_with_terms') и t('agree_with_promotion') — это ссылки на PDF

  useEffect(() => {
    try {
      const tokenObj = JSON.parse(localStorage.getItem('access') || '{}');
      if (tokenObj.access) {
        history.replace('/a/home');
      }
    } catch (e) {
      // ignore JSON parse error
    }
  }, []);

  const [phone, setPhone] = useState('');
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const saved = localStorage.getItem('auth_secondsLeft');
    const savedTime = localStorage.getItem('auth_secondsLeft_time');
    if (saved && savedTime) {
      const diff = Math.floor((Date.now() - Number(savedTime)) / 1000);
      const left = Number(saved) - diff;
      return left > 0 ? left : 0;
    }
    return 0;
  });
  const [agree, setAgree] = useState(false);
  const [referralAgree, setReferralAgree] = useState(false);
  const [error, setError] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phoneInputRef = useRef<HTMLIonInputElement>(null);

  const referralId = pathname.split('/')[3];
  const { data: referralData } = useUsersNameRetrieveQuery(
    referralId ? Number(referralId) : skipToken
  );

  const [sendSms, { isLoading: isSending }] = useSendSmsMutation();

  useEffect(() => {
    setTimeout(() => {
      phoneInputRef.current?.setFocus();
    }, 300);
  }, []);

  const handleSendSms = async () => {
    setError('');
    const num = '+996' + phone;
    try {
      await sendSms({ phoneNumber: num }).unwrap();
      // After successful SMS send, navigate to /a/auth/verify and pass phone and referralId via state
      history.push('/a/auth/verify', { phone, referralId });
    } catch (e: unknown) {
      if (isErrorWithData(e) && e.data) {
        if (e.data.secondsLeft) {
          setSecondsLeft(e.data.secondsLeft);
          localStorage.setItem('auth_secondsLeft', String(e.data.secondsLeft));
          localStorage.setItem('auth_secondsLeft_time', String(Date.now()));
        }
        setError(e.data.error || 'Ошибка отправки SMS');
      } else {
        setError('Ошибка отправки SMS');
      }
    }
  };

  useEffect(() => {
    if (secondsLeft > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            localStorage.removeItem('auth_secondsLeft');
            localStorage.removeItem('auth_secondsLeft_time');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [secondsLeft]);

  useEffect(() => {
    setSecondsLeft(0);
    localStorage.removeItem('auth_secondsLeft');
    localStorage.removeItem('auth_secondsLeft_time');
  }, []);

  return (
    <IonPage>
      <IonContent scrollY={false}>
        <div className='ion-content'>
          <div style={{ padding: '120px 24px 0 24px', textAlign: 'center' }}>
            <div className='onboarding-form'>
              <h2 className='onboarding-title'>{t('screen_title_earn')}</h2>
              <p className='onboarding-subtitle'>{t('input_phone_label')}</p>
              <div className='onboarding-phoneNumber'>
                <span style={{ marginRight: 8, fontSize: 22 }}>+996</span>
                <IonInput
                  ref={phoneInputRef}
                  type='tel'
                  placeholder='XXXXXXXXX'
                  value={phone}
                  onIonInput={(e) => {
                    const raw = (e.detail.value || '').replace(/\D/g, '');
                    if (raw.length > 0 && raw[0] === '0') return;
                    setPhone(raw.slice(0, 9));
                  }}
                  maxlength={9}
                  style={{
                    fontSize: 22,
                    padding: 8,
                    borderRadius: 4,
                    width: 140,
                  }}
                />
              </div>
              <IonItem style={{ width: '100%' }}>
                <IonCheckbox
                  className='onboarding-checkbox'
                  checked={agree}
                  onIonChange={(e) => setAgree(e.detail.checked)}
                  labelPlacement='end'
                >
                  {getFile('agree_with_terms') ? (
                    <a
                      href={getFile('agree_with_terms')}
                      target='_blank'
                      rel='noopener noreferrer'
                      style={{
                        textDecoration: 'underline',
                        color: '#1976d2',
                        marginLeft: 4,
                        whiteSpace: 'break-spaces',
                      }}
                    >
                      {t('agree_with_terms')}
                    </a>
                  ) : (
                    <span style={{ color: '#888', marginLeft: 4 }}>
                      {t('agree_with_terms') || 'оферты OA.KG (файл недоступен)'}
                    </span>
                  )}
                </IonCheckbox>
              </IonItem>
              <IonItem>
                <IonCheckbox
                  className='onboarding-checkbox'
                  checked={referralAgree}
                  onIonChange={(e) => setReferralAgree(e.detail.checked)}
                  labelPlacement='end'
                >
                  {getFile('agree_with_promotion') ? (
                    <a
                      href={getFile('agree_with_promotion')}
                      target='_blank'
                      rel='noopener noreferrer'
                      style={{
                        textDecoration: 'underline',
                        color: '#1976d2',
                        marginLeft: 4,
                        whiteSpace: 'break-spaces',
                      }}
                    >
                      {t('agree_with_promotion')}
                    </a>
                  ) : (
                    <span style={{ color: '#888', marginLeft: 4 }}>
                      {t('agree_with_promotion') || 'условиями участия в реферальной акции (файл недоступен)'}
                    </span>
                  )}
                </IonCheckbox>
              </IonItem>
              {isSending ? (
                <p className='onboarding-sms'>{t('sms_disclaimer')}</p>
              ) : (
                ''
              )}
              {referralId && (
                <div
                  style={{
                    textAlign: 'left',
                    paddingTop: 16,
                    gap: 8,
                  }}
                >
                  Вас пригласил:
                  <IonInput
                    readonly
                    fill='outline'
                    value={
                      referralData?.fullName?.trim()
                        ? referralData.fullName
                        : referralData?.phoneNumber
                    }
                    style={{
                      height: 40,
                      minHeight: 20,
                      marginTop: 8,
                    }}
                  />
                </div>
              )}
              {error && (
                <IonText
                  color='danger'
                  style={{ display: 'block', marginBottom: 8 }}
                >
                  {error}
                </IonText>
              )}
              <GaIonButton
                expand='block'
                disabled={!phone || !agree || !referralAgree || phone.length < 9 || isSending}
                onClick={handleSendSms}
                style={{ marginTop: 24 }}
                className='primary-btn'
                gaEventName='auth_send_sms'
              >
                {isSending
                  ? t('sending') || 'Отправка...'
                  : t('cta_start_earning_1')}
              </GaIonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Auth;
