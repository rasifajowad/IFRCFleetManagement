export function readStore<T>(key: string, fallback: T): T {
try {
const raw = localStorage.getItem(key);
return raw ? (JSON.parse(raw) as T) : fallback;
} catch {
return fallback;
}
}


export function writeStore<T>(key: string, value: T) {
try {
localStorage.setItem(key, JSON.stringify(value));
} catch {
// ignore write errors in demo
}
}