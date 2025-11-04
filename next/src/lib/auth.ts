import { cookies } from 'next/headers'
import crypto from 'node:crypto'
import { prisma } from './db'

const SESSION_COOKIE = 'app_session'
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me'

type SessionPayload = { id: string; role: 'staff' | 'driver' | 'officer'; name: string; email?: string | null }

function b64url(input: Buffer | string) {
  const s = (input instanceof Buffer ? input : Buffer.from(input))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  return s
}

function sign(data: string) {
  return b64url(crypto.createHmac('sha256', AUTH_SECRET).update(data).digest())
}

export function createToken(payload: SessionPayload) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = b64url(JSON.stringify(payload))
  const sig = sign(`${header}.${body}`)
  return `${header}.${body}.${sig}`
}

export function verifyToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [h, b, s] = parts
  const exp = sign(`${h}.${b}`)
  if (crypto.timingSafeEqual(Buffer.from(s), Buffer.from(exp)) === false) return null
  try {
    const payload = JSON.parse(Buffer.from(b, 'base64').toString('utf8'))
    return payload
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const payload = verifyToken(token)
  if (!payload) return null
  // Optional: ensure user still exists
  const user = await prisma.user.findUnique({ where: { id: payload.id } })
  if (!user) return null
  return { id: user.id, role: user.role as SessionPayload['role'], name: user.name, email: user.email ?? null }
}

export function buildSessionCookie(token: string) {
  const cookie = `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  return cookie
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`
}

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `scrypt:${salt}:${hash}`
}

export async function verifyPassword(password: string, stored?: string | null) {
  if (!stored) return false
  const [alg, salt, hash] = stored.split(':')
  if (alg !== 'scrypt' || !salt || !hash) return false
  const test = crypto.scryptSync(password, salt, 64).toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(test))
}

