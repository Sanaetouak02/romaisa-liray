import Image, { StaticImageData } from 'next/image'
import SectionTitle from './SectionTitle'
import styles from './AboutSection.module.css'
import aboutImage from '../pic/Pic5.png'
import expertiseIcon from '../images/EXPERTISE.svg'
import qualiteIcon from '../images/QUALITE.svg'
import reactiviteIcon from '../images/REACTIVITE.svg'
import solutionIcon from '../images/SOLUTION.svg'

const values = [
  {
    icon: expertiseIcon,
    title: 'EXPERTISE TECHNIQUE',
    text: 'Nos équipes sont composées de techniciens qualifiés maîtrisant les technologies les plus récentes dans le domaine de l\'assainissement et de l\'hydraulique.'
  },
  {
    icon: reactiviteIcon,
    title: 'RÉACTIVITÉ',
    text: 'Nous nous engageons à intervenir dans les meilleurs délais avec efficacité, pour minimiser l\'impact sur vos activités et garantir la continuité de vos services.'
  },
  {
    icon: qualiteIcon,
    title: 'QUALITÉ & FIABILITÉ',
    text: 'Nous utilisons des matériaux de qualité et des méthodes rigoureuses pour assurer des installations durables, sécurisées et conformes aux normes en vigueur.'
  },
  {
    icon: solutionIcon,
    title: 'SOLUTIONS SUR MESURE',
    text: 'Chaque projet est unique. Nous analysons vos besoins en profondeur pour proposer des solutions adaptées, performantes et évolutives.'
  },
]

function ValueIcon({ icon, title }: { icon: string | StaticImageData; title: string }) {
  const src = typeof icon === 'string' ? icon : icon.src

  return (
    <img
      src={src}
      alt={title}
      className={styles.valueImage}
    />
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
                  <ValueIcon icon={value.icon} title={value.title} />
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