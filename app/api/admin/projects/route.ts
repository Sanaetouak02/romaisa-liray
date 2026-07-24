import prisma from '../../../../lib/prisma'
import { getAdminUserFromRequest } from '../../../../lib/adminAuth'

export async function GET(request: Request) {
  const user = await getAdminUserFromRequest(request)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })
  }

  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
  return new Response(JSON.stringify(projects), { status: 200 })
}

export async function POST(request: Request) {
  const user = await getAdminUserFromRequest(request)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })
  }

  const body = await request.json()
  const { title, description, image, client, category } = body || {}
  if (!description || !image) {
    return new Response(JSON.stringify({ error: 'Paramètres invalides' }), { status: 400 })
  }

  const project = await prisma.project.create({
    data: {
      title: title || description.slice(0, 40) || 'Réalisation',
      description,
      image,
      client: client || '',
      category: category || '',
    },
  })

  return new Response(JSON.stringify(project), { status: 201 })
}
