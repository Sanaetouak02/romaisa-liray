import prisma from './prisma'

const COOKIE_NAME = 'rl_admin'
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'change-me-to-a-secure-secret'
// Session max age in seconds (default 1 year). Increase if you want longer persistent logins.
const SESSION_MAX_AGE = 60 * 60 * 24 * 365

async function sign(value: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(value)
  const keyData = encoder.encode(SESSION_SECRET)

  if (typeof globalThis.crypto?.subtle === 'undefined') {
    throw new Error('Web Crypto API is required for admin authentication')
  }

  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, data)
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function createAdminToken(userId: number) {
  const payload = `${userId}.${Date.now()}`
  return `${payload}.${await sign(payload)}`
}

export async function verifyAdminToken(token: string | null | undefined) {
  if (!token) {
    return null
  }

  const [userId, timestamp, signature] = token.split('.')

  if (!userId || !timestamp || !signature) {
    return null
  }

  const payload = `${userId}.${timestamp}`
  if ((await sign(payload)) !== signature) {
    return null
  }

  const time = Number(timestamp)
  if (Number.isNaN(time) || time + SESSION_MAX_AGE * 1000 < Date.now()) {
    return null
  }

  return Number(userId)
}

export function getAdminCookieName() {
  return COOKIE_NAME
}

export function getSessionMaxAge() {
  return SESSION_MAX_AGE
}

export async function getAdminUserFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const authCookie = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`))

  if (!authCookie) {
    return null
  }

  const token = decodeURIComponent(authCookie.split('=')[1] || '')
  const userId = await verifyAdminToken(token)
  if (!userId) {
    return null
  }

  return prisma.adminUser.findUnique({
    where: {
      id: userId,
    },
  })
}
