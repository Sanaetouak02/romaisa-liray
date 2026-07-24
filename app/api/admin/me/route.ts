import prisma from '../../../../lib/prisma'
import { getAdminUserFromRequest } from '../../../../lib/adminAuth'

export async function GET(request: Request) {
  const user = await getAdminUserFromRequest(request)

  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autorisé.' }), { status: 401 })
  }

  return new Response(
    JSON.stringify({
      id: user.id,
      name: user.name || 'Administrateur',
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

export async function PUT(request: Request) {
  const user = await getAdminUserFromRequest(request)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autorisé.' }), { status: 401 })
  }

  const body = await request.json()
  const { email, password, currentPassword } = body || {}

  // If updating password, require currentPassword match (basic check)
  if (password) {
    if (!currentPassword || currentPassword !== user.password) {
      return new Response(JSON.stringify({ error: 'Mot de passe actuel invalide.' }), { status: 401 })
    }
  }

  const updated = await prisma.adminUser.update({
    where: { id: user.id },
    data: {
      email: email || user.email,
      password: password ? password : user.password,
    },
  })

  return new Response(
    JSON.stringify({ id: updated.id, name: updated.name || 'Administrateur', email: updated.email, createdAt: updated.createdAt.toISOString() }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  )
}
