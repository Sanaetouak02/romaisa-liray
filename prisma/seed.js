const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const hashedPassword = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10)

async function main() {
  await prisma.adminUser.upsert({
    where: { email: 'admin@romaisa.com' },
    create: {
      email: 'admin@romaisa.com',
      password: hashedPassword,
      name: 'Administrateur',
    },
    update: {
      password: hashedPassword,
    },
  })
  

  const contact = await prisma.contactSetting.upsert({
    where: { id: 1 },
    create: {
      email: 'eurlromaisa@gmail.com',
      address: '258 Logement Participatif, Fouka, Tipaza',
    },
    update: {
      email: 'eurlromaisa@gmail.com',
      address: '258 Logement Participatif, Fouka, Tipaza',
    },
  })

  // Reset phone numbers and insert the seeded ones
  await prisma.phoneNumber.deleteMany({ where: { contactSettingId: contact.id } })
  await prisma.phoneNumber.createMany({
    data: [
      { number: '0550 88 98 34', contactSettingId: contact.id },
      { number: '0664 52 58 76', contactSettingId: contact.id },
      { number: '0554 20 67 11', contactSettingId: contact.id },
    ],
  })

  await prisma.project.createMany({
    data: [
      {
        title: 'Station de pompage',
        description: 'Conception, installation et maintenance complète de stations de pompage haute performance.',
        image: 'https://images.unsplash.com/photo-1581094794329-c81c4c0a40b5?w=800&h=600&fit=crop',
        client: '',
        category: 'Pompage',
      },
      {
        title: 'Réseaux d’assainissement',
        description: 'Fourniture et pose de réseaux d’assainissement en PVC et béton armé.',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
        client: '',
        category: 'Assainissement',
      },
      {
        title: 'Réseau d’eau potable',
        description: 'Construction de réseaux d’adduction d’eau potable fiables pour les communes.',
        image: 'https://images.unsplash.com/photo-1581093454534-8d77f4835150?w=800&h=600&fit=crop',
        client: '',
        category: 'Eau potable',
      },
      {
        title: 'Installation industrielle',
        description: 'Mise en place d’installations industrielles de distribution et traitement d’eau.',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=600&fit=crop',
        client: '',
        category: 'Industriel',
      },
      {
        title: 'Maintenance et dépannage',
        description: 'Interventions rapides pour maintenance préventive et dépannage urgent.',
        image: 'https://images.unsplash.com/photo-1590490360187-1f0b28166dc3?w=800&h=600&fit=crop',
        client: '',
        category: 'Maintenance',
      },
      {
        title: 'Ouvrage d’assainissement',
        description: 'Réalisation d’ouvrages d’assainissement durables et conformes aux normes et références.',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop',
        client: '',
        category: 'Ouvrage',
      },
    ],
    skipDuplicates: true,
  })

  await prisma.reference.createMany({
    data: [
      {
        name: 'COMMUNE DE DOUAOUDA',
        description: 'Réalisation d’un réseau d’assainissement Ø 800 mm en béton armé sur 600 mètres.',
        category: 'Public',
      },
      {
        name: 'COMMUNE DE CHAÏBA',
        description: 'Réalisation d’un réseau d’assainissement Ø 300 mm en PVC sur 300 mètre avec fosse septique',
        category: 'Public',
      },
      {
        name: 'COMMUNE DE FOUKA',
        description: 'Réalisation d’un réseau d’assainissement Ø 300 mm en PVC sur 250 mètre',
        category: 'Public',
      },
      {
        name: 'COMMUNE DE KOLEA',
        description: 'Réalisation d’un réseau d’assainissement Ø 400 mm en PVC sur 200 mètre',
        category: 'Public',
      },
      {
        name: 'COMMUNE DE KHMISTI',
        description: 'Réalisation d’un réseau d’assainissement Ø 400 mm en PVC sur 300 mètre',
        category: 'Public',
      },
      {
        name: 'COMMUNE DE ZÉRALDA',
        description: 'Réalisation d’un réseau d’assainissement Ø 400 mm en PVC sur 350 mètre • Réalisation d’un réseau d’assainissement Ø 300 mm en PVC sur 200 mètre',
        category: 'Public',
      },
      {
        name: 'ENTREPRISE PUBLIQUE EGUIVA',
        description: 'Réalisation d’un réseau d’assainissement Ø 500 mm en PVC sur 150 mètre • Réalisation d’un réseau d’eau potable Ø 300 mm en PEHD PN 16 sur 500 mètre',
        category: 'Entreprise',
      },
      {
        name: 'ECOLE SUPÉRIEURE D’HÔTELLERIE ET DE RESTAURATION D’ALGER',
        description: 'Intervention sur cave et vide sanitaires, pompage et nettoyage et réparation de conduite d’eau et d’assainissement',
        category: 'Entreprise',
      },
      {
        name: 'ENTREPRISE EL MORDJAN',
        description: 'Maintenance et réparation du réseau d’eau froide et eau chaude de l’usine',
        category: 'Entreprise',
      },
    ],
    skipDuplicates: true,
  })

  // Seed services
  await prisma.service.createMany({
    data: [
      { number: '01', title: 'TRAVAUX HYDRAULIQUES', description: "Installation de réseaux d'adduction d'eau, pompage, systèmes d'arrosage automatique et gestion des eaux usées.", icon: 'drop' },
      { number: '02', title: 'PLOMBERIE SANITAIRE', description: "Pose de réseaux complets, robinetterie, chauffe-eau industriels et aménagement de blocs sanitaires.", icon: 'faucet' },
      { number: '03', title: 'MAINTENANCE ET DÉPANNAGE', description: "Contrats d'entretien préventif, recherche de fuites et interventions d'urgence pour assurer la continuité de vos installations.", icon: 'tools' },
      { number: '04', title: 'SYSTÈMES DE CHAUFFAGE ET CLIMATISATION', description: "Installation de pompes à chaleur et solutions thermiques optimisées pour vos bâtiments et installations.", icon: 'climate' },
    ],
    skipDuplicates: true,
  })

  // Seed clients
  await prisma.client.createMany({
    data: [
      { name: 'Sheraton', logo: '/images/sheraton.png' },
      { name: 'El Mordjene', logo: '/images/mordjene.webp' },
      { name: 'Dreamy', logo: '/images/dreamy.webp' },
      { name: 'CTP', logo: '/images/cttp.webp' },
      { name: 'École Supérieure', logo: '/images/ecole.webp' },
      { name: 'BERMI', logo: '/images/bermi.webp' },
    ],
    skipDuplicates: true,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
