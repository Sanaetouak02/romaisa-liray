import prisma from '../../../../lib/prisma'
import { getAdminUserFromRequest } from '../../../../lib/adminAuth'

export async function GET(request: Request) {
  const user = await getAdminUserFromRequest(request)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })
  }

  const references = await prisma.reference.findMany({ orderBy: { createdAt: 'desc' } })
  return new Response(JSON.stringify(references), { status: 200 })
}

export async function POST(request: Request) {
  const user = await getAdminUserFromRequest(request)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })
  }

  const body = await request.json()
  const { name, description, category } = body || {}
  if (!name || !description) {
    return new Response(JSON.stringify({ error: 'Paramètres invalides' }), { status: 400 })
  }

  const reference = await prisma.reference.create({
    data: { name, description, category },
  })

  return new Response(JSON.stringify(reference), { status: 201 })
}
