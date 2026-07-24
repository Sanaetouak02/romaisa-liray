import prisma from '../../../../../lib/prisma'
import { getAdminUserFromRequest } from '../../../../../lib/adminAuth'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getAdminUserFromRequest(request)
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })

  const id = Number(params.id)
  const service = await prisma.service.findUnique({ where: { id } })
  if (!service) return new Response(JSON.stringify({ error: 'Non trouvé' }), { status: 404 })
  return new Response(JSON.stringify(service), { status: 200 })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getAdminUserFromRequest(request)
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })

  const id = Number(params.id)
  const body = await request.json()
  const { number, title, description, icon, image } = body || {}
  try {
    const updated = await prisma.service.update({ where: { id }, data: { number, title, description, icon, image } })
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
    await prisma.service.delete({ where: { id } })
    return new Response(null, { status: 204 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Erreur' }), { status: 400 })
  }
}
