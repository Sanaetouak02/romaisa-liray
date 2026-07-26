import { Prisma } from '@prisma/client'
import prisma from '../../../../lib/prisma'
import { getAdminUserFromRequest } from '../../../../lib/adminAuth'

export async function GET(request: Request) {
  const user = await getAdminUserFromRequest(request)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })
  }

  const url = new URL(request.url)
  const q = url.searchParams.get('q')

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { category: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : undefined

  const references = await prisma.reference.findMany({ where, orderBy: { createdAt: 'desc' } })
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
