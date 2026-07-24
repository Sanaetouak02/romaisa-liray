import Image from 'next/image'
import SectionTitle from './SectionTitle'
import styles from './ContactSection.module.css'
import prisma from '../lib/prisma'

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
              <svg viewBox="0 0 40 40" fill="none">
                <path d="M20 8c-6.6 0-12 5.4-12 12 0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="#075bd8"/>
                <circle cx="20" cy="20" r="5" fill="#ffffff"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>SIÈGE SOCIAL</h3>
            <div className={styles.cardContent}>{contact?.address || '—'}</div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" fill="#075bd8"/>
                <path d="M26 28l-5-3-6 3 2-7-5-4 14-3z" fill="#ffffff"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>TÉLÉPHONE</h3>
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
              <svg viewBox="0 0 40 40" fill="none">
                <rect x="4" y="10" width="32" height="20" rx="2" fill="#075bd8"/>
                <path d="M4 14l16 10 16-10" fill="#ffffff"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>E-MAIL</h3>
            <div className={styles.cardContent}><a href={`mailto:${contact?.email || 'info@example.com'}`}>{contact?.email || '—'}</a></div>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" fill="#075bd8"/>
                <path d="M14 26l4-6 4 3 4-6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="10" y="24" width="8" height="4" fill="#ffffff"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>ACTIVITÉ</h3>
            <div className={styles.cardContent}>Travaux d'assainissement et d'hydraulique</div>
          </div>
        </div>

      </div>
    </section>
  )
}