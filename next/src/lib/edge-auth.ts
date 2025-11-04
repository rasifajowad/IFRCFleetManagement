// Edge-compatible verification of our HMAC-SHA256 session token
// Token format: base64url(header).base64url(payload).base64url(signature)

export type EdgeSession = { id: string; role: 'staff' | 'driver' | 'officer'; name: string; email?: string | null }

function b64urlToUint8Array(b64url: string): Uint8Array {
  const pad = '='.repeat((4 - (b64url.length % 4)) % 4)
  const b64 = (b64url + pad).replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function uint8ArrayToB64url(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const b64 = btoa(binary)
  return b64.replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export async function verifyTokenEdge(token: string | undefined | null, secret: string): Promise<EdgeSession | null> {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [h, p, s] = parts
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const data = new TextEncoder().encode(`${h}.${p}`)
  const sig = await crypto.subtle.sign('HMAC', key, data)
  const expected = uint8ArrayToB64url(new Uint8Array(sig))
  if (expected !== s) return null
  try {
    const payloadJson = new TextDecoder().decode(b64urlToUint8Array(p))
    const payload = JSON.parse(payloadJson)
    return payload as EdgeSession
  } catch {
    return null
  }
}

