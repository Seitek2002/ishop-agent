import React, { useEffect, useMemo, useState } from 'react';
import {
  IonPage,
  IonButton,
  IonInput,
  IonIcon,
  useIonRouter,
  IonToast,
} from '@ionic/react';
import { timeOutline } from 'ionicons/icons';
import {
  useLazyGetWithdrawalMethodsQuery,
  WithdrawalMethod,
  useLazyGetOperationsQuery,
  Operation,
  useCreateWithdrawalRequestMutation,
} from '../../services/api';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setTransaction } from '../../store/index';
import { CompareLocaldata } from '../../helpers/CompareLocaldata';
import { useGetCurrentUserQuery } from '../../services/api';

import qrCodeOutline from '../../assets/qr-outline.svg';

import './styles.scss';

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

const Withdraw: React.FC = () => {
  const navigate = useIonRouter();
  const dispatch = useAppDispatch();

  const localHistory = localStorage.getItem('operations') || '[]';
  const localData = localStorage.getItem('withdrawalMethods') || '[]';

  const { data: user } = useGetCurrentUserQuery();
  const [getOperations] = useLazyGetOperationsQuery();
  const [getWithdrawalMethods] = useLazyGetWithdrawalMethodsQuery();
  const [requestMoney] = useCreateWithdrawalRequestMutation();

  const defaultNumber = useMemo(
    () => user?.phoneNumber.slice(4) || '',
    [user?.phoneNumber]
  );

  const [phone, setPhone] = useState('');
  const [selectedBank, setSelectedBank] = useState<WithdrawalMethod>({
    id: 0,
    name: '',
    image: '',
    requireUserQr: false,
  });
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [history, setHistory] = useState<Operation[]>(JSON.parse(localHistory));
  const [data, setData] = useState<WithdrawalMethod[]>(JSON.parse(localData));
  const [toast, setToast] = useState<{
    show: boolean;
    msg: string;
    color?: string;
  }>({
    show: false,
    msg: '',
    color: 'danger',
  });
  const [qrFile, setQrFile] = useState<File | null>(null);
  const qrInputRef = React.useRef<HTMLInputElement>(null);

  const handleFetch = async () => {
    const res = await getWithdrawalMethods().unwrap();
    CompareLocaldata({
      oldData: localData,
      newData: res,
      localKey: 'withdrawalMethods',
      setState: (data) => setData(Array.isArray(data) ? data : []),
    });
  };

  const handleFetchHistory = async () => {
    const res = await getOperations({ type: 'withdrawal' }).unwrap();
    CompareLocaldata({
      oldData: localHistory,
      newData: res,
      localKey: 'operations',
      setState: (data) => setHistory(Array.isArray(data) ? data : []),
    });
  };

  const handleWithdraw = async () => {
    const balance = Number(user?.balance ?? 0);
    const amt = Number(amount);

    if (!amt) {
      setToast({ show: true, msg: 'Введите сумму' });
      return;
    }

    if (amt > balance) {
      setToast({
        show: true,
        msg: `Недостаточно средств. Доступно ${balance} сом`,
      });
      return;
    }

    if (user?.identificationStatus !== 'approved') {
      navigate.push('/a/withdraw/identification');
      return;
    }

    if (selectedBank.requireUserQr && !qrFile) {
      setToast({ show: true, msg: 'Пожалуйста, загрузите QR-код' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('requisiteImage', qrFile || '');
      const res = await requestMoney({
        amount: amt + '',
        method: selectedBank.id,
        requisite: '996' + defaultNumber,
        requisiteImage: qrFile || undefined,
      }).unwrap();
      dispatch(setTransaction(res as any));
      navigate.push('/a/withdraw/info', 'forward', 'replace');
    } catch (error: unknown) {
      let msg = 'Ошибка создания заявки на вывод';
      if (error && typeof error === 'object' && 'data' in error) {
        const data = (error as any).data;
        if (data) {
          if (typeof data === 'string') {
            msg = data;
          } else if (typeof data === 'object') {
            if ('error' in data && typeof (data as any).error === 'string') {
              msg = (data as any).error;
            } else if ('detail' in data && typeof (data as any).detail === 'string') {
              msg = (data as any).detail;
            }
          }
        }
      }
      setToast({ show: true, msg, color: 'danger' });
    }
  };

  const handleQrClick = () => {
    qrInputRef.current?.click();
  };

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQrFile(e.target.files[0]);
      setToast({
        show: true,
        msg: 'QR-код успешно загружен',
        color: 'success',
      });
    } else {
      setToast({ show: true, msg: 'Ошибка загрузки QR-кода' });
    }
  };

  useEffect(() => {
    handleFetchHistory();
    handleFetch();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Выбрать первый банк по умолчанию после загрузки
    if (data.length > 0 && !selectedBank) {
      setSelectedBank(data[0]);
    }
  }, [data, selectedBank]);

  return (
    <IonPage className='withdraw-page'>
      <IonToast
        isOpen={toast.show}
        message={toast.msg}
        duration={2500}
        color={toast.color}
        onDidDismiss={() => setToast({ show: false, msg: '' })}
      />
      <div>
        <div className='withdraw-form-block'>
          <div className='withdraw-title'>Вывод денег</div>

          <div className='withdraw-label'>Номер телефона</div>
          <div className='withdraw-phone'>
            <span>+996</span>
            <IonInput
              className='withdraw-phone-input'
              value={defaultNumber || phone}
              placeholder='XXX XXX XXX'
              inputMode='tel'
              maxlength={9}
              onIonChange={(e) => setPhone(e.detail.value!)}
              readonly
              disabled
              mode='ios'
              style={{
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                fontSize: 16,
                fontWeight: 400,
                padding: 0,
                width: '100%',
                color: '#000',
              }}
            />
          </div>
          <div className='withdraw-phone-hint'>
            Для изменения номера обратитесь в службу поддержки
          </div>

          <div className='withdraw-row'>
            <span>Сумма (сом)</span>
            <span className='withdraw-available'>
              Доступно {user?.balance} сом
            </span>
          </div>
          <label className='withdraw-input-label'>
            <IonInput
              className='withdraw-input'
              value={amount}
              type='number'
              mode='md'
              placeholder='Введите сумму'
              onIonInput={(e) => {
                setAmount(e.detail.value!);
                setAmountError('');
              }}
              onBlur={() => {
                const amt = Number(amount);
                if (amount && amt < 100) {
                  setAmountError('Минимальная сумма вывода — 100 сом');
                } else {
                  setAmountError('');
                }
              }}
              max={user?.balance || 0}
              style={{
                padding: '0 16px',
              }}
            />
            {amountError && (
              <div style={{ color: '#e53935', fontSize: 13, marginTop: 4 }}>
                {amountError}
              </div>
            )}
          </label>
          <span
            style={{
              fontSize: 12,
              color: '#888',
              display: 'block',
              marginBottom: 16,
            }}
          >
            В соответствии с п.  2 ст. 187 Налогового кодекса (в редакции Закона
            КР № 78‑З от 3 .04.23 г., с изменениями от 12 .02.25). Со всех
            выплат свыше 5000 с. будет удержан подоходного налога в размере
            10 %.
            <b style={{ color: '#00c334ff' }}>
               Вам поступит:
              {(() => {
                const amt = Number(amount);
                const withdrawn = +(user?.withdrawnTotal || '0');
                if (!amt) return '';
                if (withdrawn >= 5000) {
                  return (amt * 0.9).toFixed(2) + ' сом';
                }
                if (withdrawn + amt > 5000) {
                  const taxable = withdrawn + amt - 5000;
                  const nonTaxable = amt - taxable;
                  return (nonTaxable + taxable * 0.9).toFixed(2) + ' сом';
                }
                return amt.toFixed(2) + ' сом';
              })()}
            </b>
          </span>

          <div className='withdraw-label'>Куда</div>
          <div className='withdraw-bank-list'>
            {data?.map((bank) => (
              <div
                key={bank.id}
                className={
                  'withdraw-bank-item' +
                  (selectedBank.id === bank.id ? ' selected' : '')
                }
                onClick={() => setSelectedBank(bank)}
              >
                <span className='withdraw-bank-radio'></span>
                <img
                  src={bank.image}
                  alt={bank.name}
                  className='withdraw-bank-icon'
                />
                <span className='withdraw-bank-label'>{bank.name}</span>
              </div>
            ))}
          </div>
          {selectedBank.requireUserQr && (
            <div
              className='withdraw-qr-upload'
              style={{
                background: '#f6f6f6',
                borderRadius: 24,
                padding: '32px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '24px 0',
                textAlign: 'center',
              }}
              onClick={handleQrClick}
            >
              <input
                ref={qrInputRef}
                type='file'
                accept='image/*'
                style={{ display: 'none' }}
                onChange={handleQrChange}
              />
              <IonIcon
                icon={qrCodeOutline}
                style={{
                  fontSize: 48,
                  color: '#2563eb',
                  marginBottom: 16,
                }}
              />
              <div
                style={{
                  fontSize: 16,
                  color: '#222',
                  fontWeight: 400,
                  lineHeight: '1.3',
                }}
              >
                {qrFile ? (
                  <>
                    <span style={{ color: '#2563eb', fontWeight: 500 }}>
                      Файл загружен:
                    </span>
                    <br />
                    <span style={{ fontSize: 15 }}>{qrFile.name}</span>
                    <br />
                    <img
                      src={URL.createObjectURL(qrFile)}
                      alt='QR'
                      style={{
                        marginTop: 12,
                        maxWidth: 180,
                        maxHeight: 180,
                        borderRadius: 12,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    />
                  </>
                ) : (
                  <>
                    Загрузите снимок своего
                    <br />
                    QR-кода из MBANK, O! Деньги или др.
                  </>
                )}
              </div>
            </div>
          )}

          <IonButton
            expand='block'
            className='withdraw-btn'
            onClick={handleWithdraw}
          >
            Вывести деньги
          </IonButton>
        </div>

        {/* Блок с историей выводов */}
        <div className='withdraw-history'>
          {history.map((item) => (
            <div
              className='withdraw-history-card'
              key={item.id + item.status + item.createdAt}
            >
              <div className='withdraw-history-row'>
                <span className='withdraw-history-id'>№{item.id}</span>
                <span className='withdraw-history-date'>
                  <IonIcon
                    className='withdraw-history-icon'
                    icon={timeOutline}
                  />{' '}
                  {formatDate(item.createdAt)}
                </span>
              </div>
              <div className='withdraw-history-info'>
                Сумма: <span>{item.amountDisplay} сом</span>
              </div>
              <div className={`withdraw-history-status ${item.status}`}>
                Статус: <span>{item.status}</span>
              </div>
              {item.comment && (
                <div className='withdraw-history-info'>
                  Комментарий: {item.comment}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </IonPage>
  );
};

export default Withdraw;
