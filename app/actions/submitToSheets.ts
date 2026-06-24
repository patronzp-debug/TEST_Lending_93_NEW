'use server'

import { google } from 'googleapis'
import {
  RECRUITING_RATE_LIMIT_MS,
  recruitingFormSchema,
  type RecruitingFormPayload,
} from '@/lib/validation/recruitingForm'

const phoneSubmissionTimes = new Map<string, number>()

export async function submitToSheets(data: RecruitingFormPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const parsed = recruitingFormSchema.safeParse(data)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Перевірте правильність заповнення форми.'
      return { success: false, error: firstError }
    }

    const formData = parsed.data
    const nowMs = Date.now()
    const lastSubmissionAt = phoneSubmissionTimes.get(formData.phone)

    if (lastSubmissionAt && nowMs - lastSubmissionAt < RECRUITING_RATE_LIMIT_MS) {
      const minutesLeft = Math.ceil((RECRUITING_RATE_LIMIT_MS - (nowMs - lastSubmissionAt)) / 60000)
      return {
        success: false,
        error: `Заявку з цим номером вже надіслано. Спробуйте ще раз через ${minutesLeft} хв.`,
      }
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_CLIENT_EMAIL || !privateKey) {
      throw new Error('Відсутні змінні оточення для Google Sheets API.')
    }

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    const now = new Date()
    const formattedDate = now.toLocaleString('uk-UA', {
      timeZone: 'Europe/Kyiv',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const experienceLabel = formData.hasExperience === 'yes' ? 'Так' : 'Ні'

    const row = [
      formattedDate,          // Дата
      formData.fullName,      // ПІБ
      formData.phone,         // Телефон
      String(formData.age),   // Вік
      '',                     // Напрямок (резервна колонка — якщо є в шапці)
      formData.position,      // Позиція/Спеціальність
      experienceLabel,        // Досвід
      'Новий',                // Статус
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    })

    phoneSubmissionTimes.set(formData.phone, nowMs)

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Невідома помилка'
    console.error('[submitToSheets]', message)
    return { success: false, error: message }
  }
}
