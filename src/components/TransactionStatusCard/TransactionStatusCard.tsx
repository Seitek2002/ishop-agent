import { FC } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonImg,
} from '@ionic/react';
import { timeOutline } from 'ionicons/icons';
import { useTexts } from '../../context/TextsContext';

import clock from '../../assets/clock-time.svg';

import './styles.scss';

interface ITransactionStatusCardProps {
  type: 'withdrawal' | 'referral' | 'osago';
  id: string;
  timestamp: string;
  amountDisplay: number;
  status: 'rejected' | 'paid' | 'created' | '';
  requisiteDisplay?: string;
  comments?: string;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}

const getTitleByType = (type: string, t: (key: string) => string): string => {
  switch (type) {
    case 'referral':
      return t('income_agent');
    case 'osago':
      return t('income_osago');
    case 'withdrawal':
      return t('withdraw_label');
    default:
      return t('transaction') || 'Транзакция';
  }
};

const TransactionStatusCard: FC<ITransactionStatusCardProps> = ({
  type,
  id,
  timestamp,
  amountDisplay,
  status,
  requisiteDisplay,
  comments,
}) => {
  const { t } = useTexts();
  const title = getTitleByType(type, t);
  const isPending = status === 'created';
  const formattedTimestamp = formatDate(timestamp);

  return (
    <IonCard className='transactionStatusCard' mode='md'>
      {isPending && (
        <IonCardHeader className='transactionStatusCard-header'>
          <IonImg className='clock' src={clock} alt='Clock' />
          <div className='transactionHeader'>
            {t('withdraw_desc_1')
              .split('.')
              .map((line, idx) =>
                line.trim() ? (
                  <p className='' key={idx}>
                    {line.trim()}
                  </p>
                ) : null
              )}
          </div>
        </IonCardHeader>
      )}
      {/* Заголовок с суммой */}
      {(status === '' || status === 'rejected' || status === 'paid') && (
        <IonCardHeader>
          <IonCardTitle className='transactionStatusCard-title'>
            {title}
          </IonCardTitle>
          <p className={`transactionStatusCard-amount ${type}`}>
            {amountDisplay}
          </p>
        </IonCardHeader>
      )}
      {/* Контент с деталями */}
      <IonCardContent>
        <div
          className={`transactionStatusCard-header transactionDetails  ${type}`}
        >
          <h2>№{id}</h2>
          <p className='transactionDetails-item'>
            <IonIcon icon={timeOutline} /> {formattedTimestamp}
          </p>
        </div>

        {isPending && requisiteDisplay && (
          <p className='transactionDetails-item'>
            {t('withdraw_detail_1')}: <span>{requisiteDisplay}</span>
          </p>
        )}
        {isPending && (
          <p className='transactionDetails-item'>
            {t('withdraw_detail_2')}:{' '}
            <span>
              {amountDisplay} {t('balance_currency') || 'сом'}
            </span>
          </p>
        )}
        {isPending && (
          <p className='transactionDetails-item status-item'>
            {t('withdraw_detail_3')}:{' '}
            <span className='status'>
              {t('pending_status') || 'На рассмотрении'}
            </span>
          </p>
        )}
        {comments && (
          <>
            <p className='transactionDetails-item'>
              {t('withdraw_detail_4') || 'Комментарии:'}
            </p>
            <div className='transactionDetails-comments'>{comments}</div>
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default TransactionStatusCard;
