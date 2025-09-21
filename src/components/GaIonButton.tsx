import React from 'react';
import { IonButton } from '@ionic/react';
import { sendGaEvent } from '../helpers/ga';

/**
 * Кнопка с автоматической отправкой события в Google Analytics
 * @param props - все стандартные пропсы IonButton
 */
const GaIonButton: React.FC<React.ComponentProps<typeof IonButton> & { gaEventName?: string }> = ({
  onClick,
  gaEventName,
  children,
  ...rest
}) => {
  const handleClick = (e: any) => {
    // Сначала отправляем событие в GA
    sendGaEvent(gaEventName || 'button_click', {
      label: typeof children === 'string' ? children : undefined,
    });
    // Затем вызываем оригинальный обработчик
    if (onClick) onClick(e);
  };

  return (
    <IonButton {...rest} onClick={handleClick}>
      {children}
    </IonButton>
  );
};

export default GaIonButton;
