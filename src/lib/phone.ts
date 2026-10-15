/** Раздел 8.1 ТЗ: нормализация телефона перед отправкой. */

export function digitsOnly(value: string): string {
  return value.replace(/\D+/g, '');
}

/**
 * Оставляем только цифры; добавляем код страны 996,
 * если номер начинается с 0 или состоит из 9 цифр.
 */
export function normalizePhone(value: string): string {
  let digits = digitsOnly(value);
  if (digits.startsWith('0')) digits = `996${digits.slice(1)}`;
  else if (digits.length === 9) digits = `996${digits}`;
  return `+${digits}`;
}
