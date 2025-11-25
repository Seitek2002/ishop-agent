import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IonContent, IonText } from '@ionic/react';
import GaIonButton from '../../components/GaIonButton';
import { useHistory } from 'react-router-dom';
import SwiperCore from 'swiper';

import img1 from '../../assets/onboarding/image-1.png';
import img2 from '../../assets/onboarding/image-2.png';

import 'swiper/css';
import '../../components/OnboardingModal.css'
import './style.scss';

import { useTexts } from '../../context/TextsContext';

const slideKeys = [
  {
    image: img1,
    titleKey: 'promo_title_1',
    subtitleKey: 'earn_10_percent',
    extraKey: null,
  },
  {
    image: img2,
    titleKey: 'promo_title_2',
    subtitleKey: 'bonus_5_percent',
    extraKey: null,
  },
];

const Onboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const history = useHistory();
  const swiperRef = useRef<SwiperCore>(null);
  const { t } = useTexts();

  // Redirect if onboarding was already seen
  React.useEffect(() => {
    if (localStorage.getItem('onboardingSeen') === 'true') {
      const redirect = localStorage.getItem('postOnboardingRedirect');
      if (redirect) {
        localStorage.removeItem('postOnboardingRedirect');
        history.replace(redirect);
      } else {
        history.replace('/a/auth');
      }
    }
  }, [history]);

  const renderPagination = () => (
    <div className='onboarding-pagination'>
      {slideKeys.map((_, idx: number) => (
        <span
          key={idx}
          className={`onboarding-dot${currentSlide === idx ? ' active' : ''}`}
        />
      ))}
    </div>
  );

  const handleStart = () => {
    localStorage.setItem('onboardingSeen', 'true');
    const redirect = localStorage.getItem('postOnboardingRedirect');
    if (redirect) {
      localStorage.removeItem('postOnboardingRedirect');
      history.replace(redirect);
    } else {
      history.push('/a/auth');
    }
  };

  return (
    <IonContent scrollY={false}>
      <div className='ion-content onboarding-content' style={{ overflow: 'auto' }}>
        <div style={{ paddingTop: '120px', textAlign: 'center' }}>
          <Swiper
            slidesPerView={1}
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            initialSlide={currentSlide}
            speed={400}
            allowTouchMove={true}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {slideKeys.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={slide.image}
                  alt=''
                  style={{
                    width: '80%',
                    maxHeight: 200,
                    objectFit: 'contain',
                  }}
                />
                {slide.extraKey && t(slide.extraKey) && (
                  <IonText color='medium' style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: 14,
                        display: 'block',
                        marginTop: 12,
                      }}
                    >
                      {t(slide.extraKey)}
                    </span>
                  </IonText>
                )}
                <h2 style={{ marginTop: 24 }} className='swiper-title'>
                  {t(slide.titleKey)}
                </h2>
                <p>{t(slide.subtitleKey)}</p>
              </SwiperSlide>
            ))}
          </Swiper>
          {renderPagination()}
        </div>
        <div className='onboarding-actions'>
          <GaIonButton
            expand='block'
            className='primary-btn'
            onClick={handleStart}
            gaEventName='onboarding_start'
          >
            {t('cta_start_earning_1')}
          </GaIonButton>
          <GaIonButton
            fill='clear'
            expand='block'
            onClick={() => {
              localStorage.setItem('onboardingSeen', 'true');
              const redirect = localStorage.getItem('postOnboardingRedirect');
              if (redirect) {
                localStorage.removeItem('postOnboardingRedirect');
                history.replace(redirect);
              } else {
                history.push('/a/auth');
              }
            }}
            gaEventName='onboarding_skip'
          >
            {t('btn_skip')}
          </GaIonButton>
        </div>
      </div>
    </IonContent>
  );
};

export default Onboarding;
