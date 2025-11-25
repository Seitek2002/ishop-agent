import { FC, useEffect, useRef, useState } from 'react';
import { IonButton, IonPage, IonToast } from '@ionic/react';

import {
  OrganizationListItem,
  useLazyGetCurrentUserQuery,
  useDetectNumberMutation,
} from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';
import { useTexts } from '../../context/TextsContext';

import car from '../../assets/car.svg';
import warning from '../../assets/warning.svg';

import './style.scss';
import OrganizationCard from '../../components/OrganizationCard/OrganizationCard';

const ReferralInfo: FC = () => {
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
  const localOrganization: OrganizationListItem[] = JSON.parse(
    localStorage.getItem('policies') || '[]'
  );

  const [data, setData] = useState(JSON.parse(localData));
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://ishop.kg/${
    localStorage.getItem('referral') || ''
  }?ref=${data?.id ?? ''}`;

  const [getUserInfo] = useLazyGetCurrentUserQuery();
  const [detectNumber] = useDetectNumberMutation();

  // Hidden media elements and processing utilities
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const streamRef = useRef<MediaStream | null>(null);

  // Timers and buffering
  const captureIntervalRef = useRef<number | null>(null);
  const pickIntervalRef = useRef<number | null>(null);
  const frameBufferRef = useRef<{ blob: Blob; score: number }[]>([]);
  const sendingRef = useRef(false);

  // Primitive sharpness estimation (grayscale sum as per provided spec)
  function sharpnessScore(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let sum = 0;
    for (let i = 0; i < img.length; i += 4) {
      const g = img[i] * 0.299 + img[i + 1] * 0.587 + img[i + 2] * 0.114;
      sum += g;
    }
    return sum;
  }

  // Start camera, capture frames every 100ms, each second pick the sharpest and send
  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: { ideal: 'environment' },
          },
          audio: false,
        });

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Attempt to autoplay without user interaction (mobile may require gesture)
          await videoRef.current.play().catch(() => {});
        }

        const canvas = canvasRef.current;
        canvas.width = 640;
        canvas.height = 480;

        // Capture frames every 100ms and keep last 10 in buffer
        captureIntervalRef.current = window.setInterval(() => {
          const video = videoRef.current;
          if (!video) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const score = sharpnessScore(canvas);

          canvas.toBlob(
            (blob) => {
              if (!blob) return;
              const buf = frameBufferRef.current;
              buf.push({ blob, score });
              if (buf.length > 10) buf.shift();
            },
            'image/jpeg',
            0.85
          );
        }, 100);

        // Each second select the sharpest frame, send to server, clear buffer
        pickIntervalRef.current = window.setInterval(async () => {
          const buf = frameBufferRef.current;
          if (buf.length === 0 || sendingRef.current) return;

          let best = buf[0];
          for (let i = 1; i < buf.length; i++) {
            if (buf[i].score > best.score) best = buf[i];
          }

          // Clear buffer for next second window
          frameBufferRef.current = [];

          try {
            sendingRef.current = true;
            await detectNumber({ frame: best.blob }).unwrap();
          } catch (err) {
            console.warn('detectNumber failed', err);
          } finally {
            sendingRef.current = false;
          }
        }, 1000);
      } catch (e) {
        console.error('Camera initialization failed', e);
      }
    };

    startCamera();

    return () => {
      mounted = false;

      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
        captureIntervalRef.current = null;
      }
      if (pickIntervalRef.current) {
        clearInterval(pickIntervalRef.current);
        pickIntervalRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      frameBufferRef.current = [];
      sendingRef.current = false;
    };
  }, [detectNumber]);

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

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <IonPage className='referral-page'>
      <div className='referral-card'>
        {/* <img
          src={referralLogo}
          alt={t('company_name')}
          className='referral-logo'
        />
        <div className='referral-description'>{t('company_description')}</div>
        <div className='referral-title'>{t('referral_title')}</div> */}
        <div style={{ textAlign: 'left' }}>
          <OrganizationCard
            buttons={false}
            organization={
              localOrganization.filter(
                (item) => item.slug === localStorage.getItem('referral')
              )[0]
            }
          />
        </div>

        <div
          className='referral-code'
          style={{
            fontSize: '20px',
            border: '1px solid #000',
            padding: '10px',
            cursor: 'pointer',
            userSelect: 'text',
            marginBottom: 12,
            borderRadius: '45px',
            backgroundColor: '#854C9D10',
            color: '#6495ED',
          }}
          role='button'
          tabIndex={0}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(shareUrl);
              setCopied(true);
            } catch {
              // Fallback: create temporary textarea
              try {
                const ta = document.createElement('textarea');
                ta.value = shareUrl;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                setCopied(true);
              } catch (e) {
                console.warn('Fallback copy failed', e);
              }
            }
          }}
          onKeyDown={async (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              try {
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
              } catch (e) {
                console.warn('Clipboard write failed', e);
              }
            }
          }}
        >
          {shareUrl}
        </div>
        <p className='earn-percent-2' style={{ fontSize: '14px' }}>
          {t('earn_10_percent')}
        </p>

        <IonButton
          expand='block'
          className='primary-btn'
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: t('share_osago_link_title'),
                text: t('share_osago_link_text'),
                url: localStorage.getItem('referral') + '?ref=' + data.id,
              });
            } else {
              alert('Web Share API не поддерживается на этом устройстве');
            }
          }}
        >
          <svg
            fill='#fff'
            viewBox='-2 -2 24 24'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='xMinYMin'
            className='jam jam-share-alt'
            stroke='#fff'
            width={20}
            style={{
              marginRight: '10px'
            }}
          >
            <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
            <g
              id='SVGRepo_tracerCarrier'
              stroke-linecap='round'
              stroke-linejoin='round'
            ></g>
            <g id='SVGRepo_iconCarrier'>
              <path d='M16 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7.928 9.24a4.02 4.02 0 0 1-.026 1.644l5.04 2.537a4 4 0 1 1-.867 1.803l-5.09-2.562a4 4 0 1 1 .083-5.228l5.036-2.522a4 4 0 1 1 .929 1.772L7.928 9.24zM4 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'></path>
            </g>
          </svg>
          {t('btn_share')}
        </IonButton>

        <IonButton
          expand='block'
          className='referral-btn'
          fill='outline'
          onClick={() => {
            window.location.href =
              'https://ishop.kg/' +
              localStorage.getItem('referral') +
              '?ref=' +
              data.id;
          }}
        >
          <img src={car} alt='car' />
          {t('btn_issue_other')}
        </IonButton>

        <div className='referral-hint'>
          <img src={warning} alt='warning' />
          <span>{t('referral_instructions')}</span>
        </div>
      </div>
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        style={{ display: 'none', width: 0, height: 0 }}
      />
      <IonToast
        isOpen={copied}
        message='Ссылка скопирована'
        duration={1500}
        position='top'
        onDidDismiss={() => setCopied(false)}
      />
    </IonPage>
  );
};

export default ReferralInfo;
