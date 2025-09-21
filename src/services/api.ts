import { createApi } from '@reduxjs/toolkit/query/react';
import { getBaseQuery } from './baseQuery';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: getBaseQuery(),
  tagTypes: ['CurrentUser'],
  endpoints: (builder) => ({
    getPageTexts: builder.query<PageTextsResponse, void>({
      query: () => ({
        url: 'https://oa.kg/api/page-texts/',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    sendSms: builder.mutation<{ success: boolean }, { phoneNumber: string }>({
      query: ({ phoneNumber }) => ({
        url: 'https://oa.kg/api/auth/sms/send/',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ phoneNumber }).toString(),
      }),
    }),
    updateCurrentUser: builder.mutation<UserMeResponse, UserMeUpdateRequest>({
      query: (body) => ({
        url: 'https://oa.kg/api/users/me/',
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(body as Record<string, string>).toString(),
      }),
      invalidatesTags: ['CurrentUser'],
    }),
    patchCurrentUser: builder.mutation<UserMeResponse, UserMeUpdateRequest>({
      query: (body) => ({
        url: 'https://oa.kg/api/users/me/',
        method: 'PATCH',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(body as Record<string, string>).toString(),
      }),
    }),
    verifySms: builder.mutation<
      { access?: string; refresh?: string },
      { phoneNumber: string; code: string; referralCode?: string }
    >({
      query: ({ phoneNumber, code, referralCode }) => {
        const pattern = referralCode
          ? new URLSearchParams({
              phoneNumber,
              code,
              referralCode,
            })
          : new URLSearchParams({
              phoneNumber,
              code,
            });

        return {
          url: 'https://oa.kg/api/auth/sms/verify/',
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: pattern.toString(),
        };
      },
    }),
    getCurrentUser: builder.query<UserMeResponse, void>({
      query: () => ({
        url: 'https://oa.kg/api/users/me',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
      providesTags: ['CurrentUser'],
    }),
    getPolicies: builder.query<Policy[], void>({
      query: () => ({
        url: 'https://oa.kg/api/policies/me',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    ocrCreate: builder.mutation<OcrResponse, OcrRequest>({
      query: ({ documentType, frontImage, backImage }) => {
        const formData = new FormData();
        formData.append('frontImage', frontImage);
        formData.append('backImage', backImage);
        return {
          url: 'https://oa.kg/api/ocr2/',
          method: 'POST',
          body: formData,
          params: { documentType },
        };
      },
    }),
    getReferrals: builder.query<Referral[], void>({
      query: () => ({
        url: 'https://oa.kg/api/referrals/me/',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    createIdentification: builder.mutation<unknown, FormData>({
      query: (body) => ({
        url: 'https://oa.kg/api/users/identification/',
        method: 'POST',
        body,
      }),
    }),
    getOperations: builder.query<Operation[], { type?: string } | void>({
      query: (params) => {
        const url = 'https://oa.kg/api/operations/me/';
        if (params && params.type) {
          return {
            url,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            params: { type: params.type },
          };
        }
        return {
          url,
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        };
      },
    }),
    createWithdrawalRequest: builder.mutation<
      unknown,
      {
        method: number;
        requisite: string;
        amount: string;
        requisiteImage?: File;
      }
    >({
      query: ({ method, requisite, amount, requisiteImage }) => {
        const formData = new FormData();
        formData.append('method', String(method));
        formData.append('requisite', requisite);
        formData.append('amount', amount);
        if (requisiteImage) {
          formData.append('requisiteImage', requisiteImage);
        }
        return {
          url: 'https://oa.kg/api/withdrawal-requests/',
          method: 'POST',
          headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json',
          },
          body: formData,
        };
      },
    }),
    getWithdrawalMethods: builder.query<WithdrawalMethod[], void>({
      query: () => ({
        url: 'https://oa.kg/api/withdrawal-methods/',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    getQaList: builder.query<QaItem[], { type: string }>({
      query: ({ type }) => ({
        url: 'https://oa.kg/api/qa/',
        method: 'GET',
        params: { type },
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
    usersNameRetrieve: builder.query<
      {
        id: number;
        fullName?: string;
        phoneNumber: string;
        referralId: number;
      },
      number
    >({
      query: (id) => ({
        url: `https://oa.kg/api/users/${id}/name/`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
    }),
  }),
});

export interface PageText {
  id: number;
  key: string;
  text: string;
  file?: string;
}

export interface PageTextsResponse {
  version: number;
  results: PageText[];
}

export const {
  useSendSmsMutation,
  useVerifySmsMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  usePatchCurrentUserMutation,
  useGetPoliciesQuery,
  useLazyGetPoliciesQuery,
  useOcrCreateMutation,
  useCreateIdentificationMutation,
  useGetReferralsQuery,
  useLazyGetReferralsQuery,
  useGetOperationsQuery,
  useLazyGetOperationsQuery,
  useGetWithdrawalMethodsQuery,
  useLazyGetWithdrawalMethodsQuery,
  useGetPageTextsQuery,
  useLazyGetPageTextsQuery,
  useGetQaListQuery,
  useUsersNameRetrieveQuery,
  useCreateWithdrawalRequestMutation,
} = api;

// Типизация ответа для /api/users/me/
export interface UserMeResponse {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  passportSelfie: string | null;
  balance: string;
  withdrawnTotal: string;
  totalIncome: string;
  osagoIncome: string;
  agentsIncome: string;
  osagoCount: number;
  agentsCount: number;
  referralLink: string;
  authReferralLink: string;
  identificationStatus: string;
  totalAgents: number;
  averageAgentsIncome: string;
}

export interface UserMeUpdateRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
}

export interface Policy {
  id: number;
  fullName: string;
  startDate: string;
  endDate: string;
  vehicle: string | null;
  policyPdfUrl: string;
}

export interface OcrRequest {
  documentType: 'passport' | 'driver_license' | 'vehicle_cert';
  frontImage: File;
  backImage: File;
}
export interface OcrPassportData {
  surname: string;
  name: string;
  patronymic: string;
  gender: string;
  birthDate: string;
  documentNumber: string;
  expiryDate: string;
  authority: string;
  issueDate: string;
  birthPlace: string;
  personalNumber: string;
  ethnicity: string;
  series: string;
  number: string;
}

export interface OcrResponse {
  id: number;
  data: OcrPassportData;
}

export interface Referral {
  id: number;
  fullName: string;
  phoneNumber: string;
  dateJoined: string;
  osagoCount: number;
  osagoIncome: string;
}

export interface Operation {
  id: string;
  type: 'withdrawal' | 'osago' | 'referral';
  status: 'created' | 'rejected' | 'paid' | '';
  createdAt: string;
  amountDisplay: string;
  comment?: string;
  requisiteDisplay: string;
}

export interface WithdrawalMethod {
  id: number;
  name: string;
  image: string;
  requireUserQr: boolean;
}

export interface QaItem {
  id: number;
  type: 'osago' | 'nc' | 'vzr' | 'faq';
  question: string;
  answer: string;
}
