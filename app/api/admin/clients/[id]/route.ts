import prisma from '../../../../../lib/prisma'
import { getAdminUserFromRequest } from '../../../../../lib/adminAuth'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getAdminUserFromRequest(request)
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })

  const id = Number(params.id)
  const client = await prisma.client.findUnique({ where: { id } })
  if (!client) return new Response(JSON.stringify({ error: 'Non trouvé' }), { status: 404 })
  return new Response(JSON.stringify(client), { status: 200 })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getAdminUserFromRequest(request)
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })

  const id = Number(params.id)
  const body = await request.json()
  const { name, logo } = body || {}
  if (!name || !logo) {
    return new Response(JSON.stringify({ error: 'Paramètres invalides' }), { status: 400 })
  }

  try {
    const updated = await prisma.client.update({ where: { id }, data: { name, logo } })
    return new Response(JSON.stringify(updated), { status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Erreur' }), { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getAdminUserFromRequest(request)
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })

  const id = Number(params.id)
  try {
    await prisma.client.delete({ where: { id } })
    return new Response(null, { status: 204 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Erreur' }), { status: 400 })
  }
}
