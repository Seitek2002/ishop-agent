import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent,
  IonText,
  IonInputOtp,
  IonPage,
} from '@ionic/react';
import GaIonButton from '../../components/GaIonButton';
import { useVerifySmsMutation, useUsersNameRetrieveQuery } from '../../services/api';
import { skipToken } from '@reduxjs/toolkit/query';
import { useHistory, useLocation, useParams } from 'react-router-dom';
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

interface RouteParams {
  phone: string;
  referralId?: string;
}

const AuthVerify: React.FC = () => {
  const { t } = useTexts();
  const history = useHistory();
  const otpInputRef = useRef<any>(null);

  // Get phone and referralId from route params or location state
  const params = useParams<RouteParams>();
  const location = useLocation<{ phone?: string; referralId?: string }>();
  const phone = params.phone || location.state?.phone || '';
  const referralId = params.referralId || location.state?.referralId;

  const { data: referralData } = useUsersNameRetrieveQuery(
    referralId ? Number(referralId) : skipToken
  );

  const [smsCode, setSmsCode] = useState('');
  const [error, setError] = useState('');
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

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [verifySms, { isLoading: isVerifying }] = useVerifySmsMutation();

  useEffect(() => {
    if (smsCode.length === 6 && !isVerifying) {
      handleVerify();
    }
    // eslint-disable-next-line
  }, [smsCode, isVerifying]);

  useEffect(() => {
    setTimeout(() => {
      otpInputRef.current?.setFocus?.();
    }, 300);
  }, []);

  const handleVerify = async () => {
    setError('');
    const num = '+996' + phone;
    const send: { phoneNumber: string; code: string; referralCode?: string } = {
      phoneNumber: num,
      code: smsCode,
      referralCode: undefined,
    };
    setSmsCode('');

    if (referralId) {
      send.referralCode = referralId;
    }

    try {
      const data = await verifySms({ ...send }).unwrap();
      if (data.access) {
        localStorage.setItem('access', JSON.stringify(data));
      }
      history.replace('/a/home');
    } catch (e: unknown) {
      if (isErrorWithData(e) && e.data) {
        setError(e.data.error || 'Ошибка проверки кода');
      } else {
        setError('Ошибка проверки кода');
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
    // Reset timer if needed when mounting
    // (no-op here, but can be extended)
  }, []);

  // Resend SMS is handled in Auth page, so here we just show the timer

  return (
    <IonPage>
      <IonContent scrollY={false}>
        <div className='ion-content'>
          <div style={{ padding: '120px 24px 0 24px', textAlign: 'center' }}>
            <div className='onboarding-form'>
              <h2>{t('input_sms_label')}</h2>
              <IonInputOtp
                ref={otpInputRef}
                length={6}
                value={smsCode}
                onIonInput={(e) => setSmsCode(e.detail.value!)}
              />
              <div style={{ marginTop: 16 }}>
                {t('not_received_code') || 'Не получили код?'}{' '}
                {secondsLeft > 0 ? (
                  <span style={{ color: '#888', marginLeft: 8 }}>
                    Повторная отправка через {secondsLeft} сек.
                  </span>
                ) : (
                  <span style={{ color: '#1976d2', marginLeft: 8 }}>
                    Запросите новый код на предыдущей странице
                  </span>
                )}
              </div>
              {error && (
                <IonText
                  color='danger'
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    textAlign: 'center',
                  }}
                >
                  {error}
                </IonText>
              )}
              <GaIonButton
                expand='block'
                disabled={smsCode.length < 5 || isVerifying}
                onClick={handleVerify}
                style={{ marginTop: 24 }}
                className='primary-btn'
                gaEventName='auth_verify_sms'
              >
                {isVerifying
                  ? t('verifying') || 'Проверка...'
                  : t('cta_start_earning_1')}
              </GaIonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AuthVerify;
