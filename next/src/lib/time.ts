export function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function endOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x
}

export function pctInDay(date: Date, day: Date, startHour = 8, endHour = 20) {
  const start = new Date(day); start.setHours(startHour, 0, 0, 0)
  const end = new Date(day); end.setHours(endHour, 0, 0, 0)
  const total = end.getTime() - start.getTime()
  return Math.min(100, Math.max(0, ((date.getTime() - start.getTime()) / total) * 100))
}

export function toISODate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function hoursRange(start = 8, end = 20) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

