import Image from 'next/image'
import SectionTitle from './SectionTitle'
import styles from './AboutSection.module.css'
import aboutImage from '../images/Catalogue EURL ROMAISA LIRAY _20260715_133859_0001.png'

const values = [
  {
    icon: 'worker',
    title: 'EXPERTISE TECHNIQUE',
    text: 'Nos équipes sont composées de techniciens qualifiés maîtrisant les technologies les plus récentes dans le domaine de l\'assainissement et de l\'hydraulique.'
  },
  {
    icon: 'clock',
    title: 'RÉACTIVITÉ',
    text: 'Nous nous engageons à intervenir dans les meilleurs délais avec efficacité, pour minimiser l\'impact sur vos activités et garantir la continuité de vos services.'
  },
  {
    icon: 'shield',
    title: 'QUALITÉ & FIABILITÉ',
    text: 'Nous utilisons des matériaux de qualité et des méthodes rigoureuses pour assurer des installations durables, sécurisées et conformes aux normes en vigueur.'
  },
  {
    icon: 'gear',
    title: 'SOLUTIONS SUR MESURE',
    text: 'Chaque projet est unique. Nous analysons vos besoins en profondeur pour proposer des solutions adaptées, performantes et évolutives.'
  },
]

function ValueIcon({ name }: { name: string }) {
  if (name === 'worker') {
    return (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="14" r="8" fill="#ffffff"/>
        <path d="M12 42v-6c0-6.6 5.4-12 12-12s12 5.4 12 12v6" stroke="#ffffff" strokeWidth="3" strokeLinecap="round"/>
        <rect x="16" y="20" width="16" height="12" rx="2" fill="#ffffff"/>
      </svg>
    )
  }
  if (name === 'clock') {
    return (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" stroke="#ffffff" strokeWidth="3"/>
        <path d="M24 12v12l8 6" stroke="#ffffff" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    )
  }
  if (name === 'shield') {
    return (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4L42 12v12c0 12-7 20-18 26-11-6-18-14-18-26V12L24 4z" fill="#ffffff" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 24l5 5 10-10" stroke="#031b50" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke="#ffffff" strokeWidth="3"/>
      <circle cx="24" cy="24" r="8" stroke="#ffffff" strokeWidth="3"/>
      <path d="M24 10v4M24 34v4M10 24h4M34 24h4" stroke="#ffffff" strokeWidth="3" strokeLinecap="round"/>
      <path d="M15 15l3 3M30 30l3 3M15 33l3-3M30 18l3-3" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export default function AboutSection() {
  return (
    <section id="apropos" className={styles.aboutSection}>
      <div className={styles.container}>
        {/* --- PARTIE 1 : QUI SOMMES-NOUS --- */}
        <div className={styles.aboutGrid}>
          <div>
            <SectionTitle eyebrow="EURL ROMAISA LIRAY" title="Qui sommes-nous ?" />
            <p className={styles.lead}>
              <strong>EURL ROMAISA LIRAY</strong> est une entreprise spécialisée dans les travaux d'assainissement et hydraulique.
            </p>
            <p>
              Forts de notre <strong>expertise technique</strong> et de notre expérience dans le secteur du <strong>BTP</strong>, nous accompagnons les professionnels, les copropriétés et les entreprises industrielles dans la <strong>conception, la réalisation et la maintenance d'installations fluides</strong>.
            </p>
            <p>
              Notre objectif est de garantir la pérennité de vos infrastructures grâce à des <strong>solutions techniques fiables, performantes</strong> et conformes aux normes en vigueur.
            </p>
          </div>
          <div className={`image-frame ${styles.imageAbout}`}>
            <Image src={aboutImage} alt="Présentation de Romaisa Liray" fill sizes="(max-width: 900px) 100vw, 45vw" />
          </div>
        </div>

        {/* --- PARTIE 2 : POURQUOI NOUS CHOISIR (EXPERTISE) --- */}
        <div className={styles.expertiseBlock}>
          <div className={styles.expertiseHeader}>
            <h2 className={styles.mainTitle}>POURQUOI NOUS CHOISIR ?</h2>
            <p className={styles.subtitle}>
              Notre engagement : vous offrir des <strong>solutions techniques fiables, performantes et durables</strong>, adaptées à vos besoins.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {values.map((value) => (
              <div className={styles.valueCard} key={value.title}>
                <div className={styles.iconCircle}>
                  <ValueIcon name={value.icon} />
                </div>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <div className={styles.titleUnderline} />
                <p className={styles.valueText}>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}