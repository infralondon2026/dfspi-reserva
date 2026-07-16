const AR_TIME_ZONE = 'America/Argentina/Buenos_Aires'

// en-CA renders dates as YYYY-MM-DD, which is what <input type="date"> expects.
const formatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: AR_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** Calendar date (YYYY-MM-DD) in Puerto Iguazú, `days` days from now. */
export function argentinaDatePlusDays(days: number): string {
  return formatter.format(new Date(Date.now() + days * 86_400_000))
}
