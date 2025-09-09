/**
 * Formats a date into a DD-MM-YYYY string format
 * @param dateInput - Date object or string that can be parsed into a Date
 * @returns Formatted date string in DD-MM-YYYY format
 */
export function formatDateToDDMMYYYY(dateInput: Date | string | undefined | null): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
