import { z } from 'zod';

export const identificationKeys = [
  'inn',
  'passportLastName',
  'passportFirstName',
  'passportMiddleName',
  'gender',
  'birthDate',
  'documentNumber',
  'issueAuthority',
  'issueDate',
  'expiryDate',
] as const;

export const identificationSchema = z.object({
  inn: z.string().nonempty('ИНН не может быть пустым'),
  passportLastName: z.string().nonempty('Фамилия не может быть пустой'),
  passportFirstName: z.string().nonempty('Имя не может быть пустым'),
  passportMiddleName: z.string().nonempty('Отчество не может быть пустым'),
  gender: z.string().nonempty('Пол не может быть пустым'),
  birthDate: z.string().nonempty('Дата рождения не может быть пустой'),
  documentNumber: z.string().nonempty('Номер документа не может быть пустым'),
  issueAuthority: z.string().nonempty('Орган выдачи не может быть пустым'),
  issueDate: z.string().nonempty('Дата выдачи не может быть пустой'),
  expiryDate: z.string().nonempty('Дата окончания не может быть пустой'),
});
