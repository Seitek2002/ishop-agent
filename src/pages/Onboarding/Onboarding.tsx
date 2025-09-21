import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IonContent, IonText } from '@ionic/react';
import GaIonButton from '../../components/GaIonButton';
import { useHistory } from 'react-router-dom';
import SwiperCore from 'swiper';

import img1 from '../../assets/onboarding/image-1.png';
import img2 from '../../assets/onboarding/image-2.png';
import img3 from '../../assets/onboarding/image-3.png';

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
  {
    image: img3,
    titleKey: 'promo_title_3',
    subtitleKey: 'license',
    extraKey: null, // Можно добавить отдельный ключ, если появится в API
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
      history.replace('/a/auth');
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
    if (currentSlide < slideKeys.length - 1) {
      swiperRef.current?.slideNext();
    } else {
      localStorage.setItem('onboardingSeen', 'true');
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
        <div style={{ background: 'white', width: '100%', paddingBottom: '40px' }}>
          <GaIonButton
            expand='block'
            className='primary-btn'
            onClick={handleStart}
            style={{ marginTop: 32, fontSize: 16 }}
            gaEventName='onboarding_start'
          >
            {t('cta_start_earning_1')}
          </GaIonButton>
          <GaIonButton
            fill='clear'
            expand='block'
            onClick={() => {
              localStorage.setItem('onboardingSeen', 'true');
              history.push('/a/auth');
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
