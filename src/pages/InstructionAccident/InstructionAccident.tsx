import React, { useState } from 'react';
import { useHistory } from 'react-router';
import {
  IonPage,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonItem,
  IonAccordion,
  IonAccordionGroup,
  IonSpinner,
} from '@ionic/react';
import { useGetQaListQuery } from '../../services/api';

import alert from '../../assets/alert.svg';

import { arrowBackOutline } from 'ionicons/icons';

import DOMPurify from 'dompurify';

import './styles.scss';

const InstructionsPage: React.FC = () => {
  const history = useHistory();
  const [selectedSegment, setSelectedSegment] = useState<string>('osago');

  const mapSegmentToType = (seg: string) => {
    switch (seg) {
      case 'osago':
        return 'osago';
      case 'ns':
        return 'nc';
      case 'vzr':
        return 'vzr';
      default:
        return 'osago';
    }
  };

  const { data, isLoading, isError } = useGetQaListQuery({
    type: mapSegmentToType(selectedSegment),
  });

  return (
    <IonPage className='instructions-page'>
      <div>
        <div className='instructions-header'>
          <IonIcon
            onClick={() => history.goBack()}
            icon={arrowBackOutline}
            className='instructions-back'
          />
          <span className='instructions-title'>Инструкция при ДТП</span>
        </div>
        <IonSegment
          value={selectedSegment}
          onIonChange={(e) => setSelectedSegment(String(e.detail.value))}
          className='instructions-segment'
        >
          <IonSegmentButton value='osago'>
            <IonLabel>Осаго</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value='ns'>
            <IonLabel>НС</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value='vzr'>
            <IonLabel>ВЗР</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <div className='instructions-card'>
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <IonSpinner name='crescent' />
            </div>
          )}
          {isError && (
            <div style={{ textAlign: 'center', color: 'red', padding: '20px' }}>
              Произошла ошибка при загрузке данных.
            </div>
          )}
          {!isLoading && (!data || data.length === 0) && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              Нет доступных инструкций по выбранному типу.
            </div>
          )}

          {data && (
            <IonAccordionGroup multiple={true} className='instructions-list'>
              {data.map((item, i) => (
                <>
                  <IonAccordion key={item.id} value={item.id.toString()}>
                    <IonItem
                      slot='header'
                      className='instructions-item'
                      lines='none'
                    >
                      <div className='item-header'>
                        <IonLabel className='item-title'>
                          {item.question}
                        </IonLabel>
                      </div>
                    </IonItem>
                    <div slot='content' className='item-content'>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(item.answer),
                        }}
                      />
                    </div>
                  </IonAccordion>
                  {i !== data.length - 1 && <hr />}
                </>
              ))}
            </IonAccordionGroup>
          )}
        </div>

        <div className='call-block'>
          <div className='call-info'>
            <IonIcon icon={alert} className='info-icon' />
            <div className='call-texts'>
              <p className='call-text'>Кырсык боончча инспектор</p>
              <p className='call-text'>Аварийный комиссар</p>
            </div>
          </div>
          <IonButton
            href='tel:+996777394080'
            expand='block'
            className='call-button'
          >
            Позвонить
          </IonButton>
        </div>
      </div>
    </IonPage>
  );
};

export default InstructionsPage;
