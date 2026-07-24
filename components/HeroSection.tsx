import Image from 'next/image'
import heroImage from '../images/hero-background.png'
import logoMark from '../images/Logo.svg'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  return (
    <section id="accueil" className={styles.hero}>
      <Image src={heroImage} alt="Installation hydraulique Romaisa Liray" fill priority className={styles.heroImage} />
      <div className={styles.heroShade} />
      
      <div className={`${styles.heroContent} ${styles.heroCentered}`}>
        <div className={styles.heroLogoWrapper}>
          <Image src={logoMark} alt="Logo EURL Romaisa Liray" className={styles.heroLogoMain} width={100} height={100} />
          <div className={styles.heroBrandText}>
            <p className={styles.heroEurl}>EURL</p>
            <p className={styles.heroCompanyName}>ROMAISA LIRAY</p>
          </div>
        </div>

        <h1 className={styles.heroMainTitle}>
          TRAVAUX D'ASSAINISSEMENT
          <span className={styles.heroTitleHighlight}>ET HYDRAULIQUE</span>
        </h1>

        <p className={styles.heroValues}>EXPERTISE • QUALITÉ • PERFORMANCE • ENGAGEMENT</p>

        <div className={styles.heroActions}>
          <a href="#contact" className={`${styles.button} ${styles.buttonBlue}`}>Demander un devis</a>
          <a href="#services" className={`${styles.button} ${styles.buttonOutline}`}>Découvrir nos services</a>
        </div>
      </div>
    </section>
  )
}