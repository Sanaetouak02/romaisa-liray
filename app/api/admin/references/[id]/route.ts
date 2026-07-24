import prisma from '../../../../../lib/prisma'
import { getAdminUserFromRequest } from '../../../../../lib/adminAuth'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getAdminUserFromRequest(request)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })
  }

  const referenceId = Number(params.id)
  if (Number.isNaN(referenceId)) {
    return new Response(JSON.stringify({ error: 'ID invalide' }), { status: 400 })
  }

  const body = await request.json()
  const { name, description, category } = body || {}

  if (!name) {
    return new Response(JSON.stringify({ error: 'Paramètres invalides' }), { status: 400 })
  }

  const reference = await prisma.reference.update({
    where: { id: referenceId },
    data: { name, description, category },
  })

  return new Response(JSON.stringify(reference), { status: 200 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getAdminUserFromRequest(request)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })
  }

  const referenceId = Number(params.id)
  if (Number.isNaN(referenceId)) {
    return new Response(JSON.stringify({ error: 'ID invalide' }), { status: 400 })
  }

  await prisma.reference.delete({ where: { id: referenceId } })
  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
