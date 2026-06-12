'use server'

import { google } from 'googleapis'

interface FormPayload {
  fullName: string
  phone: string
  age: number
  position: string
  hasExperience: string
}

export async function submitToSheets(data: FormPayload): Promise<{ success: boolean; error?: string }> {
  try {
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

    const experienceLabel = data.hasExperience === 'yes' ? 'Так' : 'Ні'

    const row = [
      formattedDate,          // Дата
      data.fullName,          // ПІБ
      data.phone,             // Телефон
      String(data.age),       // Вік
      '',                     // Напрямок (резервна колонка — якщо є в шапці)
      data.position,          // Позиція/Спеціальність
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

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Невідома помилка'
    console.error('[submitToSheets]', message)
    return { success: false, error: message }
  }
}
