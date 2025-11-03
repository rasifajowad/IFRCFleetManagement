export const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) => aStart < bEnd && bStart < aEnd;

export const fmtTime = (s: string) => new Date(s).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
export const fmtDate = (s: string) => new Date(s).toLocaleDateString();
export const fmtTimeRange = (s: string, e: string) => `${fmtTime(s)} - ${fmtTime(e)}`;

export const fmtDateTimeLocal = (d: Date | string | number) => new Date(d).toISOString().slice(0, 16);
export const parseDT = (s: string) => new Date(s);

