import { z } from 'zod'

const CYRILLIC_NAME_PART_RE = /^[А-ЯЁЄІЇҐа-яёєіїґ]+(?:[-'][А-ЯЁЄІЇҐа-яёєіїґ]+)*$/u
const REPEATED_CHARACTER_RE = /(.)\1{4,}/u

export const RECRUITING_RATE_LIMIT_MS = 10 * 60 * 1000

function normalizeFullName(value: string) {
  return value
    .replace(/[’ʼ`]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function parseAge(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (!/^\d{1,3}$/.test(trimmed)) return Number.NaN

  return Number(trimmed)
}

export const recruitingFormSchema = z.object({
  fullName: z
    .string()
    .transform(normalizeFullName)
    .refine(value => value.length > 0, {
      message: 'Введіть ваше ПІБ',
    })
    .refine(value => value.length >= 5 && value.length <= 80, {
      message: 'ПІБ має містити від 5 до 80 символів',
    })
    .refine(value => {
      const parts = value.split(' ')
      return parts.length >= 2 && parts.length <= 4
    }, {
      message: "Введіть прізвище та ім'я, максимум 4 слова",
    })
    .refine(value => value.split(' ').every(part => part.length >= 2), {
      message: 'Кожна частина ПІБ має містити щонайменше 2 літери',
    })
    .refine(value => value.split(' ').every(part => CYRILLIC_NAME_PART_RE.test(part)), {
      message: 'ПІБ може містити лише українські або російські літери, дефіс та апостроф',
    })
    .refine(value => !REPEATED_CHARACTER_RE.test(value.toLowerCase()), {
      message: 'Перевірте ПІБ: забагато повторюваних символів',
    }),
  phone: z
    .string()
    .trim()
    .min(1, 'Введіть номер телефону')
    .regex(/^\+380\d{9}$/, 'Формат: +380XXXXXXXXX (9 цифр після +380)'),
  age: z.preprocess(
    parseAge,
    z
      .number({ error: 'Введіть вік цифрами' })
      .int('Вік має бути цілим числом')
      .min(18, 'Мінімальний вік — 18 років')
      .max(60, 'Максимальний вік — 60 років')
  ),
  position: z
    .string()
    .min(1, 'Оберіть бажану посаду'),
  hasExperience: z
    .string()
    .min(1, 'Оберіть відповідь'),
  website: z
    .string()
    .optional()
    .default('')
    .refine(value => value.trim() === '', {
      message: 'Заявку відхилено',
    }),
})

export type RecruitingFormData = z.infer<typeof recruitingFormSchema>
export type RecruitingFormPayload = z.input<typeof recruitingFormSchema>
