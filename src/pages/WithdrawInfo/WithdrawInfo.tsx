import { IonPage, IonButton } from '@ionic/react';
import { useAppSelector } from '../../hooks/useAppSelector';
import TransactionStatusCard from '../../components/TransactionStatusCard/TransactionStatusCard';
import './styles.scss';

const WithdrawInfo = () => {
  const transaction = useAppSelector((state) => state.transaction);

  // Преобразование для TransactionStatusCard (если нужно)
  const createdAt = new Date().toISOString();

  const cardData = {
    type: 'withdrawal' as const,
    status: 'paid' as const,
    id: transaction.id ? String(transaction.id) : '',
    createdAt,
    amountDisplay: Math.floor(+transaction.amount),
    requisiteDisplay: transaction.requisite,
  };

  return (
    <IonPage className='withdraw-info-page'>
      <TransactionStatusCard
        {...cardData}
        timestamp={cardData.createdAt}
      />
      <IonButton
        expand='block'
        className='withdraw-info-btn'
        routerLink='/a/home'
      >
        Вернуться на главную
      </IonButton>
    </IonPage>
  );
};

export default WithdrawInfo;
