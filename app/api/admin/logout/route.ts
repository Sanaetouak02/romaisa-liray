import { getAdminCookieName } from '../../../../lib/adminAuth'

export async function POST() {
  const headers = new Headers({ 'Set-Cookie': `${getAdminCookieName()}=deleted; HttpOnly; Path=/; Max-Age=0` })
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
}
