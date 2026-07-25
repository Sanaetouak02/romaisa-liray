import prisma from '../../../../lib/prisma'
import { createAdminToken, getAdminCookieName, getSessionMaxAge } from '../../../../lib/adminAuth'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body || {}

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email et mot de passe requis.' }), { status: 400 })
  }

  const user = await prisma.adminUser.findUnique({ where: { email } })
  if (!user) return new Response(JSON.stringify({ error: 'Identifiants invalides.' }), { status: 401 })

  let ok = await bcrypt.compare(password, user.password)
  if (!ok && user.password === password) {
    // Legacy plaintext password fallback: rehash and allow login.
    await prisma.adminUser.update({ where: { id: user.id }, data: { password: bcrypt.hashSync(password, 10) } })
    ok = true
  }
  if (!ok) return new Response(JSON.stringify({ error: 'Identifiants invalides.' }), { status: 401 })

  const token = await createAdminToken(user.id)
  const maxAge = getSessionMaxAge()
  const headers = new Headers({ 'Set-Cookie': `${getAdminCookieName()}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax` })
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
}
