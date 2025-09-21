import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

/**
 * Кастомный baseQuery с поддержкой обновления токена.
 * access и refresh теперь хранятся в localStorage в ключе "access" как объект { access, refresh }
 */

export const getBaseQuery =
  (): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =>
  async (args, api, extraOptions) => {
    const fetchQuery = fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      credentials: 'same-origin',
      prepareHeaders: (headers) => {
        let access = '';
        try {
          const tokenObj = JSON.parse(localStorage.getItem('access') || '{}');
          access = tokenObj.access || '';
        } catch {
          access = '';
        }
        const url = typeof args === 'string' ? args : args.url;
        const isAuthFree =
          url?.includes('/sms/send') || url?.includes('/sms/verify');

        if (access && !isAuthFree) {
          headers.set('Authorization', `Bearer ${access}`);
        }
        headers.set('Accept', 'application/json');
        // Добавляем язык из localStorage
        const lang = localStorage.getItem('lang') || 'ru';
        headers.set('Accept-Language', lang);
        return headers;
      },
    });

    let result = await fetchQuery(args, api, extraOptions);

    // Если 401 и не /sms/send|/sms/verify — пробуем refresh
    const url = typeof args === 'string' ? args : args.url;
    const isAuthFree =
      url?.includes('/sms/send') || url?.includes('/sms/verify');

    if (result.meta?.response?.status === 401 && !isAuthFree) {
      let refresh = '';
      try {
        const tokenObj = JSON.parse(localStorage.getItem('access') || '{}');
        refresh = tokenObj.refresh || '';
      } catch {
        refresh = '';
      }
      if (refresh) {
        // Пробуем обновить токен
        const refreshResult = await fetchQuery(
          {
            url: '/api/auth/token/refresh/',
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ refresh }).toString(),
          },
          api,
          extraOptions
        );
        if (
          refreshResult.data &&
          typeof refreshResult.data === 'object' &&
          'access' in refreshResult.data
        ) {
          // Сохраняем оба токена обратно в localStorage
          localStorage.setItem(
            'access',
            JSON.stringify({
              access: refreshResult.data.access,
              refresh,
            })
          );
          // Повторяем исходный запрос с новым токеном
          result = await fetchQuery(args, api, extraOptions);
        } else {
          // refresh неудачен — удаляем токены и редиректим
          localStorage.removeItem('access');
          window.location.href = '/a/auth';
        }
      } else {
        localStorage.removeItem('access');
        window.location.href = '/a/auth';
      }
    }

    return result;
  };
