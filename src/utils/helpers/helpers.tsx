export function getDateSpan(startDate: string, endDate: string) {
  if (startDate === '') return '';

  return endDate != null ? `(${startDate} - ${endDate})` : `(${startDate})`;
}
