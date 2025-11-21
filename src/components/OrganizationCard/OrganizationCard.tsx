import { FC } from 'react';
import { useHistory } from 'react-router';

import GaIonButton from '../GaIonButton';
import { OrganizationListItem } from '../../services/api';
import { useTexts } from '../../context/TextsContext';

const OrganizationCard: FC<{
  organization: OrganizationListItem;
  buttons?: boolean;
}> = ({ organization, buttons = true }) => {
  const history = useHistory();
  const { t } = useTexts();

  const handleReferral = (slug: string) => {
    history.push('/a/referral');
    localStorage.setItem('referral', slug);
  };

  return (
    <div className='organization-card' key={organization?.companyName}>
      <div className='organization-header'>
        <img src={organization?.logo || ''} alt='' />
        <span className='organization-name'>{organization?.companyName}</span>
      </div>
      <p className='organization-description'>{organization?.description}</p>
      <div className='organization-earns-title'>Вознаграждения:</div>
      <div className='organization-earns'>
        <div className='organization-earn'>
          <div className='organization-percent'>10%</div>
          <div>от продаж</div>
        </div>
        <div className='organization-earn'>
          <div className='organization-percent'>5%</div>
          <div>от друзей</div>
        </div>
      </div>
      {buttons && (
        <div className='organization-buttons'>
          <GaIonButton
            expand='block'
            fill='solid'
            color='primary'
            className='organization-btn'
            style={{ padding: 0 }}
            onClick={() => handleReferral(organization?.slug)}
          >
            {t('btn_download')}
          </GaIonButton>
          <GaIonButton
            expand='block'
            fill='outline'
            color='primary'
            className='organization-btn'
            style={{ padding: 0 }}
            href={'https://ishop.kg/' + organization?.slug}
            target='_blank'
            rel='noopener noreferrer'
            gaEventName='osago_download_pdf'
          >
            {t('read_more')}
          </GaIonButton>
        </div>
      )}
    </div>
  );
};

export default OrganizationCard;
