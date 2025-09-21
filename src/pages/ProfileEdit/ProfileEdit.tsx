import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import {
  IonAvatar,
  IonButton,
  IonInput,
  IonLabel,
  IonPage,
} from '@ionic/react';

import {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
} from '../../services/api';
import { useTexts } from '../../context/TextsContext';
import { z } from 'zod';

import Loader from '../../components/Loader/Loader';

import avatar from '../../assets/avatar-default.svg';

import './styles.scss';

const formDataSchema = z.object({
  firstName: z.string().min(2, { message: 'Минимум 2 символа' }),
  lastName: z.string().min(2, { message: 'Минимум 2 символа' }),
  patronymic: z.string().min(2, { message: 'Минимум 2 символа' }),
});

type FormData = z.infer<typeof formDataSchema>;

const ProfileEdit = () => {
  const history = useHistory();
  const { data: user } = useGetCurrentUserQuery();
  const { t } = useTexts();
  const [updateUser, { isLoading, isSuccess, isError }] =
    useUpdateCurrentUserMutation();

  const [userFormData, setFormData] = useState<Partial<FormData>>({});

  const initialFormState = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    patronymic: user?.middleName || '',
  };

  const formData = {
    ...initialFormState,
    ...userFormData,
  };

  const validate = () => {
    const res = formDataSchema.safeParse(formData);

    if (res.success) {
      return undefined;
    }
    return res.error.format();
  };

  const errors = validate();

  const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (errors) {
      console.log('Form has errors:', errors);
      return;
    }

    updateUser({
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      middleName: formData.patronymic || '',
    });
  };

  useEffect(() => {
    if (isSuccess) {
      history.push('/a/profile');
    }
    if (isError) {
      console.error('Ошибка при обновлении профиля');
    }
  }, [history, isError, isSuccess]);

  if (isLoading) return <Loader />;

  return (
    <IonPage className='profile-page profile-edit'>
      <div>
        <div className='profile-edit-header'>
          <IonAvatar className='profile-edit-avatar'>
            <img src={avatar} alt='Avatar' />
          </IonAvatar>
          <span>{t('header_profile_country')}</span>
        </div>
        <form className='profile-edit-form' onSubmit={handleSubmit}>
          <div className='profile-edit-group'>
            <IonLabel className='profile-edit-label'>
              {t('label_name')}
            </IonLabel>
            <IonInput
              name='firstName'
              className='profile-edit-input'
              placeholder={t('label_name')}
              value={formData.firstName}
              onIonChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  firstName: e.detail.value ?? '',
                }))
              }
            />
            {errors && errors?.firstName?._errors && (
              <span className='error'>
                {errors.firstName._errors.join(', ')}
              </span>
            )}
          </div>
          <div className='profile-edit-group'>
            <IonLabel className='profile-edit-label'>
              {t('label_surname')}
            </IonLabel>
            <IonInput
              name='lastName'
              className='profile-edit-input'
              placeholder={t('label_surname')}
              value={formData.lastName}
              onIonChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  lastName: e.detail.value ?? '',
                }))
              }
            />
            {errors && errors?.lastName?._errors && (
              <span className='error'>
                {errors.lastName._errors.join(', ')}
              </span>
            )}
          </div>
          <div className='profile-edit-group'>
            <IonLabel className='profile-edit-label'>
              {t('label_patronymic')}
            </IonLabel>
            <IonInput
              name='patronymic'
              className='profile-edit-input'
              placeholder={t('label_patronymic')}
              value={formData.patronymic}
              onIonChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  patronymic: e.detail.value ?? '',
                }))
              }
            />
            {errors && errors?.patronymic?._errors && (
              <span className='error'>
                {errors.patronymic._errors.join(', ')}
              </span>
            )}
          </div>

          <IonButton
            disabled={!!errors}
            type='submit'
            expand='block'
            size='default'
            className='profile-edit-save'
          >
            {t('btn_save')}
          </IonButton>
        </form>
      </div>
    </IonPage>
  );
};

export default ProfileEdit;
