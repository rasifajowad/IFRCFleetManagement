export function csvEscape(val: any) {
  if (val == null) return ''
  const s = String(val)
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
  return s
}

export function toCSV(rows: (any[])[]): string {
  return rows.map(r => r.map(csvEscape).join(',')).join('\n')
}

