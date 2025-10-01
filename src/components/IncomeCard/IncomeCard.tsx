import { FC, useEffect, useState } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  useIonRouter,
} from '@ionic/react';
import { useTexts } from '../../context/TextsContext';

import './styles.scss';
import { useLazyGetCurrentUserQuery } from '../../services/api';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';

interface IncomeCardProps {
  amount?: string;
  totalEarned?: string;
  onWithdraw?: () => void;
}

const IncomeCard: FC<IncomeCardProps> = ({ onWithdraw }) => {
  const navigate = useIonRouter();
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

  const [data, setData] = useState(JSON.parse(localData));

  const [getUserInfo] = useLazyGetCurrentUserQuery();

  const handleClick = () => {
    navigate.push('/a/withdraw');
    if (onWithdraw) {
      onWithdraw();
    }
  };

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

  return (
    <IonCard color='white' className='incomeCard' mode='md'>
      <div className='incomeCard-wrapper'></div>
      <IonCardHeader>
        <IonCardSubtitle className='incomeCard-subtitle'>
          {t('balance_label')}
        </IonCardSubtitle>
        <IonCardTitle className='incomeCard-title'>
          <b>
            {+data?.balance} {t('balance_currency') || 'сом'}
          </b>
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <span className='incomeCard-muted'>
          {t('total_income_label').replace(
            '1 400 000',
            `${+data?.totalIncome}` || '0'
          )}
        </span>
      </IonCardContent>
      <IonCardContent>
        <button onClick={handleClick} className='incomeCard-button'>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M12.4502 6.44995V6C12.4502 5.58579 12.1144 5.25 11.7002 5.25C11.286 5.25 10.9502 5.58579 10.9502 6V6.45346C9.28015 6.53175 7.9502 7.91054 7.9502 9.59995C7.9502 11.3396 9.3605 12.75 11.1002 12.75H12.9002C13.8115 12.75 14.5502 13.4887 14.5502 14.4C14.5502 15.3112 13.8115 16.05 12.9002 16.05H10.2143C9.79228 16.05 9.4502 15.7079 9.4502 15.2859C9.4502 14.8717 9.11441 14.5359 8.7002 14.5359C8.28598 14.5359 7.9502 14.8717 7.9502 15.2859C7.9502 16.5363 8.96385 17.55 10.2143 17.55H10.9502V18C10.9502 18.4142 11.286 18.75 11.7002 18.75C12.1144 18.75 12.4502 18.4142 12.4502 18V17.55H12.9002C14.6399 17.55 16.0502 16.1396 16.0502 14.4C16.0502 12.6603 14.6399 11.25 12.9002 11.25H11.1002C10.1889 11.25 9.4502 10.5112 9.4502 9.59995C9.4502 8.68868 10.1889 7.94995 11.1002 7.94995H11.6916C11.6944 7.94998 11.6973 7.95 11.7002 7.95C11.7031 7.95 11.706 7.94998 11.7088 7.94995H13.1699C13.6141 7.94995 13.9742 8.31007 13.9742 8.75429C13.9742 9.16851 14.31 9.50429 14.7242 9.50429C15.1384 9.50429 15.4742 9.1685 15.4742 8.75429C15.4742 7.48164 14.4425 6.44995 13.1699 6.44995H12.4502Z'
              fill='currentColor'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75Z'
              fill='currentColor'
            />
          </svg>
          {t('cashout_buttom')}
        </button>
      </IonCardContent>
    </IonCard>
  );
};

export default IncomeCard;
