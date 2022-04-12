export function getDateSpan(startDate: string, endDate: string) {
  if (startDate === '') return '';

  return endDate !== '' ? `(${startDate} - ${endDate})` : `(${startDate})`;
}
