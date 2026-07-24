import prisma from '../../../../lib/prisma'
import { getAdminUserFromRequest } from '../../../../lib/adminAuth'
import bcrypt from 'bcryptjs'

export async function GET(request: Request) {
  const user = await getAdminUserFromRequest(request)
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })
  return new Response(JSON.stringify({ id: user.id, email: user.email, name: user.name }), { status: 200 })
}

export async function PUT(request: Request) {
  const user = await getAdminUserFromRequest(request)
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })

  const body = await request.json()
  const { currentPassword, newPassword, email, name } = body || {}

  if (!currentPassword) return new Response(JSON.stringify({ error: 'Mot de passe actuel requis' }), { status: 400 })

  const dbUser = await prisma.adminUser.findUnique({ where: { id: user.id } })
  if (!dbUser) return new Response(JSON.stringify({ error: 'Utilisateur introuvable' }), { status: 404 })

  const ok = await bcrypt.compare(currentPassword, dbUser.password)
  if (!ok) return new Response(JSON.stringify({ error: 'Mot de passe incorrect' }), { status: 401 })

  const data: any = {}
  if (newPassword) data.password = bcrypt.hashSync(newPassword, 10)
  if (email) data.email = email
  if (name !== undefined) data.name = name

  const updated = await prisma.adminUser.update({ where: { id: user.id }, data })
  return new Response(JSON.stringify({ id: updated.id, email: updated.email, name: updated.name }), { status: 200 })
}
