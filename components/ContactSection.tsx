import Image from 'next/image'
import SectionTitle from './SectionTitle'
import styles from './ContactSection.module.css'
import prisma from '../lib/prisma'
import localisationIcon from '../images/localisation.svg'
import telephoneIcon from '../images/telephone.svg'
import mailIcon from '../images/mail.svg'
import activiteIcon from '../images/activite.svg'

export default async function ContactSection() {
  let contact: any = null
  try {
    contact = await prisma.contactSetting.findFirst({ include: { phoneNumbers: true } })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Prisma error in ContactSection:', err)
    contact = null
  }
  const phones = contact?.phoneNumbers || []

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.contactContainer}>
        <SectionTitle eyebrow="CONTACT" title="Construisons ensemble votre projet" />

        <p className={styles.leadText}>
          Notre équipe vous accompagne de l’étude à la réalisation. Contactez-nous dès aujourd’hui pour obtenir votre devis gratuit et discuter de vos besoins.
        </p>

        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <div className={styles.cardIcon}>
              <Image src={localisationIcon} alt="Icône de localisation" className={styles.cardImage} width={160} height={160} />
            </div>
            <div className={styles.cardContent}>{contact?.address || '—'}</div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.cardIcon}>
              <Image src={telephoneIcon} alt="Icône de téléphone" className={styles.cardImage} width={160} height={160} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.phoneNumbers}>
                {phones.map((p: any) => (
                  <a key={p.id} href={`tel:${p.number.replace(/\s/g, '')}`} className={styles.phoneButton}>{p.number}</a>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.cardIcon}>
              <Image src={mailIcon} alt="Icône de mail" className={styles.cardImage} width={160} height={160} />
            </div>
            <div className={styles.cardContent}><a href={`mailto:${contact?.email || 'info@example.com'}`}>{contact?.email || '—'}</a></div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.cardIcon}>
              <Image src={activiteIcon} alt="Icône d'activité" className={styles.cardImage} width={160} height={160} />
            </div>
            <div className={styles.cardContent}>Travaux d'assainissement et d'hydraulique</div>
          </div>
        </div>

      </div>
    </section>
  )
}