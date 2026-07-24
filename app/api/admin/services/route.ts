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
          { title: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { number: { contains: q } },
        ],
      }
    : undefined

  const services = await prisma.service.findMany({ where, orderBy: { number: 'asc' } })
  return new Response(JSON.stringify(services), { status: 200 })
}

export async function POST(request: Request) {
  const user = await getAdminUserFromRequest(request)
  if (!user) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })

  const body = await request.json()
  const { number, title, description, icon, image } = body || {}
  if (!number || !title || !description) {
    return new Response(JSON.stringify({ error: 'Paramètres invalides' }), { status: 400 })
  }

  try {
    const service = await prisma.service.create({ data: { number, title, description, icon, image } })
    return new Response(JSON.stringify(service), { status: 201 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Erreur' }), { status: 500 })
  }
}
