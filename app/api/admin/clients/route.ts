import { Prisma } from '@prisma/client'
import prisma from '../../../../lib/prisma'
import { getAdminUserFromRequest } from '../../../../lib/adminAuth'

export async function GET(request: Request) {
  const user = await getAdminUserFromRequest(request)
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })

  const url = new URL(request.url)
  const q = url.searchParams.get('q')

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ] as any,
      }
    : undefined

  const clients = await prisma.client.findMany({ where, orderBy: { id: 'asc' } })
  return new Response(JSON.stringify(clients), { status: 200 })
}

export async function POST(request: Request) {
  const user = await getAdminUserFromRequest(request)
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })

  const body = await request.json()
  const { name, logo } = body || {}
  if (!name || !logo) return new Response(JSON.stringify({ error: 'Paramètres invalides' }), { status: 400 })

  try {
    const client = await prisma.client.create({ data: { name, logo } })
    return new Response(JSON.stringify(client), { status: 201 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Erreur' }), { status: 500 })
  }
}
