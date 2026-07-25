import Image from 'next/image'
import heroImage from '../pic/Pic2.png'
import logoMark from '../images/Logo.svg'
import iconAssainissement from '../images/eau.svg'
import iconReseaux from '../images/network.svg'
import iconSolutions from '../images/Engrenage.svg'
import iconFiabilite from '../images/Bouclier.svg'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  return (
    <section id="accueil" className={styles.hero}>
      <Image src={heroImage} alt="Installation hydraulique Romaisa Liray" fill priority className={styles.heroImage} />
      <div className={styles.heroShade} />
      
      <div className={styles.heroPanel}>
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

         
        </div>

        <div className={styles.heroFooter}>
          <div className={styles.footerPillars}>
            <div className={styles.footerPillar}>
              <Image src={iconAssainissement} alt="Assainissement" width={180} height={180} className={styles.footerIcon} />
              <span className={styles.footerLabel}>ASSAINISSEMENT</span>
            </div>
            <div className={styles.footerPillar}>
              <Image src={iconReseaux} alt="Réseaux hydrauliques" width={180} height={180} className={styles.footerIcon} />
              <span className={styles.footerLabel}>RÉSEAUX HYDRAULIQUES</span>
            </div>
            <div className={styles.footerPillar}>
              <Image src={iconSolutions} alt="Solutions techniques" width={180} height={180} className={styles.footerIcon} />
              <span className={styles.footerLabel}>SOLUTIONS TECHNIQUES</span>
            </div>
            <div className={styles.footerPillar}>
              <Image src={iconFiabilite} alt="Durabilité et fiabilité" width={180} height={180} className={styles.footerIcon} />
              <span className={styles.footerLabel}>DURABILITÉ & FIABILITÉ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}