import React from 'react';
import {
  IonPage,
  IonIcon,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonSpinner,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';

import { useGetQaListQuery } from '../../services/api';

import DOMPurify from 'dompurify';

import './styles.scss';

const FaqPage: React.FC = () => {
  const { data, isLoading, isError } = useGetQaListQuery({ type: '' });

  return (
    <IonPage className='faq-page'>
      <div>
        <div className='faq-header'>
          <IonIcon
            icon={arrowBackOutline}
            className='faq-back'
            onClick={() => window.history.back()}
          />
          <span className='faq-title'>Вопросы и ответы</span>
        </div>
        <div className='faq-card'>
          {isLoading && (
            <div className='faq-loading'>
              <IonSpinner name='crescent' />
            </div>
          )}
          {isError && (
            <div className='faq-error'>
              Произошла ошибка при загрузке данных.
            </div>
          )}
          {!isLoading && (!data || data.length === 0) && (
            <div className='faq-empty'>Нет доступных вопросов.</div>
          )}
          {data && (
            <IonAccordionGroup multiple={true} className='faq-list'>
              {data.map((item, i) => (
                <>
                  <IonAccordion key={item.id} value={item.id.toString()}>
                    <IonItem slot='header' className='faq-item' lines='none'>
                      <div className='item-header'>
                        <IonLabel className='item-title'>
                          {item.question}
                        </IonLabel>
                      </div>
                    </IonItem>
                    <div slot='content' className='item-content'>
                      <span
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
      </div>
    </IonPage>
  );
};

export default FaqPage;
