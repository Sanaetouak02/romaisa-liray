import Image from 'next/image'
import SectionTitle from './SectionTitle'
import styles from './ServicesSection.module.css'
import domainsImage from '../pic/Pic4.png'
import prisma from '../lib/prisma'

// ✅ 1. Importez vos images SVG ici 
import iconChauffage from '../images/Chauffage.svg'
import iconPlomberie from '../images/Plombier.svg'
import iconMaintenance from '../images/Maintenance.svg'
import iconTravaux from '../images/Travaux.svg'

// ✅ 2. Déplacer le composant ServiceIcon en dehors du composant principal pour de meilleures performances
function ServiceIcon({ name }: { name: string }) {
  const key = name?.toLowerCase?.() ?? ''
  let src
  let alt = name

  if (key === 'chauffage') {
    src = iconChauffage
    alt = 'Chauffage'
  } else if (key === 'plombier') {
    src = iconPlomberie
    alt = 'Plomberie'
  } else if (key === 'maintenance') {
    src = iconMaintenance
    alt = 'Maintenance'
  } else if (key === 'travaux') {
    src = iconTravaux
    alt = 'Travaux'
  } else if (key.includes('chauffage') || key.includes('climat')) {
    src = iconChauffage
    alt = 'Chauffage'
  } else if (key.includes('plomb') || key.includes('faucet')) {
    src = iconPlomberie
    alt = 'Plomberie'
  } else if (key.includes('maintenance') || key.includes('dépannage') || key.includes('depannage') || key === 'tools') {
    src = iconMaintenance
    alt = 'Maintenance'
  } else if (key.includes('travaux') || key === 'drop' || key === 'water') {
    src = iconTravaux
    alt = 'Travaux'
  }

  if (!src) {
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.serviceIcon}>
        <circle cx="32" cy="32" r="12" fill="#075bd8" stroke="#031b50" strokeWidth="2"/>
        <path d="M32 16v-8M32 56v-8M16 32H8M56 32h-8" stroke="#075bd8" strokeWidth="3" strokeLinecap="round"/>
        <path d="M21 21l-6-6M49 49l-6-6M21 43l-6 6M49 15l-6 6" stroke="#075bd8" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={160}
      height={160}
      className={styles.serviceIcon}
    />
  )
}

export default async function ServicesSection() {
  let services: any[] = []
  try {
    services = await prisma.service.findMany({ orderBy: { number: 'asc' } })
  } catch (err) {
    // If DB is unreachable during dev, fall back to empty list so the page still renders
    // eslint-disable-next-line no-console
    console.error('Prisma error in ServicesSection:', err)
    services = []
  }

  return (
    <section id="services" className={styles.servicesSection}>
      <SectionTitle eyebrow="SERVICES & SOLUTIONS" title="Nos domaines d'intervention" />
      
      <div className={styles.servicesContainer}>
        {services.map((service) => (
          <article className={styles.serviceItem} key={service.number}>
            <div className={styles.serviceImageWrapper}>
              <Image
                src={service.image ?? domainsImage}
                alt={service.title}
                fill
                className={styles.serviceImage}
                sizes="(max-width: 900px) 100vw, 35vw"
              />
            </div>

            <div className={styles.serviceContent}>
              <div className={styles.serviceNumber}>{service.number}</div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
            </div>

            <div className={styles.serviceIconWrapper}>
              <ServiceIcon name={service.icon || service.title || 'default'} />
            </div>
          </article>
        ))}
      </div>

    </section>
  )
}