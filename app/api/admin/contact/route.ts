import prisma from '../../../../lib/prisma'
import { getAdminUserFromRequest } from '../../../../lib/adminAuth'

export async function GET(request: Request) {
  const user = await getAdminUserFromRequest(request)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })
  }

  const contact = await prisma.contactSetting.findFirst({ orderBy: { id: 'asc' }, include: { phoneNumbers: true } })
  const result = contact ? {
    ...contact,
    phoneNumbers: contact.phoneNumbers.map((phone) => phone.number),
  } : null

  return new Response(JSON.stringify(result), { status: 200 })
}

export async function PUT(request: Request) {
  const user = await getAdminUserFromRequest(request)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })
  }

  const body = await request.json()
  const { phoneNumbers, email, address } = body || {}

  if (!email || !address || !Array.isArray(phoneNumbers)) {
    return new Response(JSON.stringify({ error: 'Paramètres invalides' }), { status: 400 })
  }

  const contact = await prisma.contactSetting.upsert({
    where: { id: 1 },
    create: { email, address },
    update: { email, address },
  })

  // replace phone numbers
  await prisma.phoneNumber.deleteMany({ where: { contactSettingId: contact.id } })
  if (phoneNumbers.length) {
    await prisma.phoneNumber.createMany({ data: phoneNumbers.map((n: string) => ({ number: n, contactSettingId: contact.id })) })
  }

  const result = await prisma.contactSetting.findUnique({ where: { id: contact.id }, include: { phoneNumbers: true } })
  const normalizedResult = result ? {
    ...result,
    phoneNumbers: result.phoneNumbers.map((phone) => phone.number),
  } : null

  return new Response(JSON.stringify(normalizedResult), { status: 200 })
}
