import Image from 'next/image'
import SectionTitle from './SectionTitle'
import styles from './ServicesSection.module.css'
import domainsImage from '../images/Catalogue EURL ROMAISA LIRAY _20260715_133859_0003.png'
import heroImage from '../images/hero-background.png'
import prisma from '../lib/prisma'

// ✅ 1. Importez vos images SVG ici 
// ⚠️ Conseil : Renommez vos fichiers SVG/PNG sans espaces pour éviter les erreurs de chemin (ex: 'icon-assainissement.svg')
import iconAssainissement from '../images/icon-assainissement.svg'
import iconReseaux from '../images/icon-reseaux.svg'
import iconSolutions from '../images/icon-solutions.svg'
import iconFiabilite from '../images/icon-fiabilite.svg'

// ✅ 2. Déplacer le composant ServiceIcon en dehors du composant principal pour de meilleures performances
function ServiceIcon({ name }: { name: string }) {
  if (name === 'drop') {
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.serviceIcon}>
        <path d="M32 8C24 18 18 26 18 34a14 14 0 1028 0c0-8-6-16-14-26z" fill="#075bd8" stroke="#031b50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  if (name === 'faucet') {
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.serviceIcon}>
        <path d="M12 20h20M22 10v20M32 30v10a4 4 0 01-4 4h-4" stroke="#075bd8" strokeWidth="3" strokeLinecap="round"/>
        <path d="M12 40h20v8a4 4 0 01-4 4H16a4 4 0 01-4-4v-8z" fill="#075bd8" stroke="#031b50" strokeWidth="2"/>
        <path d="M32 10h8a4 4 0 010 8h-8" stroke="#075bd8" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    )
  }
  if (name === 'tools') {
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.serviceIcon}>
        <path d="M14 50l10-10M40 24l10-10M18 46l4 4M44 20l4 4" stroke="#075bd8" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="22" cy="42" r="6" stroke="#075bd8" strokeWidth="3"/>
        <circle cx="46" cy="18" r="6" stroke="#075bd8" strokeWidth="3"/>
      </svg>
    )
  }
  // Icône par défaut
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.serviceIcon}>
      <circle cx="32" cy="32" r="12" fill="#075bd8" stroke="#031b50" strokeWidth="2"/>
      <path d="M32 16v-8M32 56v-8M16 32H8M56 32h-8" stroke="#075bd8" strokeWidth="3" strokeLinecap="round"/>
      <path d="M21 21l-6-6M49 49l-6-6M21 43l-6 6M49 15l-6 6" stroke="#075bd8" strokeWidth="3" strokeLinecap="round"/>
    </svg>
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
            {/* Image à gauche */}
            {/* ⚠️ IMPORTANT : Assurez-vous que .serviceImageWrapper a "position: relative;" dans votre CSS pour que fill fonctionne */}
            <div className={styles.serviceImageWrapper}>
              <Image 
                src={domainsImage} 
                alt={service.title} 
                fill 
                className={styles.serviceImage}
                sizes="(max-width: 900px) 100vw, 35vw"
              />
            </div>
            
            {/* Contenu central */}
            <div className={styles.serviceContent}>
              <div className={styles.serviceNumber}>{service.number}</div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
            </div>
            
            {/* Icône à droite */}
            <div className={styles.serviceIconWrapper}>
              <ServiceIcon name={service.icon ?? 'default'} />
            </div>
          </article>
        ))}
      </div>

      {/* Footer bleu avec images SVG importées */}
      <div 
        className={styles.servicesFooter}
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6, 42, 114, 0.88) 0%, rgba(3, 27, 80, 0.92) 100%), url(${heroImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className={styles.footerPillars}>
          <div className={styles.footerPillar}>
            <span className={styles.footerIcon}>
              <Image src={iconAssainissement} alt="Assainissement" width={48} height={48} className={styles.footerImage} />
            </span>
            <span className={styles.footerLabel}>ASSAINISSEMENT</span>
          </div>
          <div className={styles.footerPillar}>
            <span className={styles.footerIcon}>
              <Image src={iconReseaux} alt="Réseaux hydrauliques" width={48} height={48} className={styles.footerImage} />
            </span>
            <span className={styles.footerLabel}>RÉSEAUX HYDRAULIQUES</span>
          </div>
          <div className={styles.footerPillar}>
            <span className={styles.footerIcon}>
              <Image src={iconSolutions} alt="Solutions techniques" width={48} height={48} className={styles.footerImage} />
            </span>
            <span className={styles.footerLabel}>SOLUTIONS TECHNIQUES</span>
          </div>
          <div className={styles.footerPillar}>
            <span className={styles.footerIcon}>
              <Image src={iconFiabilite} alt="Durabilité et fiabilité" width={48} height={48} className={styles.footerImage} />
            </span>
            <span className={styles.footerLabel}>DURABILITÉ & FIABILITÉ</span>
          </div>
        </div>
      </div>
    </section>
  )
}