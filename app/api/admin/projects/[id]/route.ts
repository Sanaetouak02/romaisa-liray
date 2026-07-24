import prisma from '../../../../../lib/prisma'
import { getAdminUserFromRequest } from '../../../../../lib/adminAuth'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getAdminUserFromRequest(request)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })
  }

  const projectId = Number(params.id)
  if (Number.isNaN(projectId)) {
    return new Response(JSON.stringify({ error: 'ID invalide' }), { status: 400 })
  }

  const body = await request.json()
  const { title, description, image, client, category } = body || {}

  if (!description || !image) {
    return new Response(JSON.stringify({ error: 'Paramètres invalides' }), { status: 400 })
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      title: title || 'Réalisation',
      description,
      image,
      client: client || '',
      category: category || '',
    },
  })

  return new Response(JSON.stringify(project), { status: 200 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getAdminUserFromRequest(request)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })
  }

  const projectId = Number(params.id)
  if (Number.isNaN(projectId)) {
    return new Response(JSON.stringify({ error: 'ID invalide' }), { status: 400 })
  }

  await prisma.project.delete({ where: { id: projectId } })
  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
