/**
 * Отправка события в Google Analytics 4
 * @param event - название события
 * @param params - дополнительные параметры (опционально)
 */
export function sendGaEvent(event: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, params || {});
  }
}
