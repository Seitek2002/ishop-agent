import React, { useEffect, useState } from 'react';
import { IonPage } from '@ionic/react';
import { useLazyGetOperationsQuery, Operation } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';
import TransactionStatusCard from '../../components/TransactionStatusCard/TransactionStatusCard';
import IncomeCard from '../../components/IncomeCard/IncomeCard';
import './styles.scss';
import { useTexts } from '../../context/TextsContext';

const Finances: React.FC = () => {
  // Паттерн localData + data + getOperations + handleFetch + useEffect
  const localData = localStorage.getItem('operations') || '[]';

  const [data, setData] = useState<Operation[]>(JSON.parse(localData));
  const [getOperations] = useLazyGetOperationsQuery();

  const handleFetch = async () => {
    const res = await getOperations().unwrap();
    CompareLocaldata({
      oldData: localData,
      newData: res,
      localKey: 'operations',
      setState: (data) => setData(Array.isArray(data) ? data : []),
    });
  };

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line
  }, []);

  const { t } = useTexts();
  return (
    <IonPage className='finances-page'>
      <div>
        <IncomeCard />
        <h2 className='finances-title'>{t('screen_finance') || 'История операций'}</h2>
        {data.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 32, color: '#888' }}>
            {t('no_operations') || 'Нет операций'}
          </div>
        )}
        {data.map((op, idx) => {
          // Преобразование типов для TransactionStatusCard
          const cardData = {
            type: (op.type === 'withdrawal' || op.type === 'referral' || op.type === 'osago'
              ? op.type
              : 'withdrawal') as 'withdrawal' | 'referral' | 'osago',
            id: String(op.id),
            timestamp: op.createdAt || '',
            amountDisplay: Number(op.amountDisplay ?? 0),
            status:
              op.status === 'rejected' || op.status === 'paid' || op.status === 'created'
                ? op.status as 'rejected' | 'paid' | 'created'
                : '' as '',
            requisiteDisplay: op.requisiteDisplay ?? '',
            comments: op.comment ?? '',
          };
          return (
            <TransactionStatusCard
              key={idx}
              {...cardData}
            />
          );
        })}
      </div>
    </IonPage>
  );
};

export default Finances;
