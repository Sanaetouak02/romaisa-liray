import Image from 'next/image'
import styles from './ReferencesSection.module.css'
import logo from '../images/Logo.svg'
import heroImage from '../images/hero-background.png'
import SectionTitle from './SectionTitle'
import prisma from '../lib/prisma'

export default async function ReferencesSection() {
  let references: any[] = []
  try {
    references = await prisma.reference.findMany({ orderBy: { createdAt: 'desc' } })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Prisma error in ReferencesSection:', err)
    references = []
  }
  const publicRefs = references.filter((r: any) => ((r.category || 'Public') || '').toString().toLowerCase() === 'public')
  const privateRefs = references.filter((r: any) => ((r.category || 'Public') || '').toString().toLowerCase() !== 'public')
  const totalRefs = references.length || 0

  return (
    <section className={styles.referencesSection} id="references">
      <div className={styles.headerWrapper}>
        <div className={styles.logoWrapper}>
          <Image src={logo} alt="Logo EURL Romaïsa Liray" className={styles.logo} width={80} height={80} />
        </div>
        <div className={styles.titleWrapper}>
          <SectionTitle 
            eyebrow="EURL ROMAISA LIRAY" 
            title="RÉFÉRENCES CLIENTS" 
          />
          <p className="text-sm text-indigo-100">{`Total références en base : ${totalRefs}`}</p>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M3 16h26M6 16V9a3 3 0 013-3h14a3 3 0 013 3v7M5 16v10a3 3 0 003 3h16a3 3 0 003-3V16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="9" y="19" width="5" height="5" fill="#ffffff"/>
              <rect x="18" y="19" width="5" height="5" fill="#ffffff"/>
            </svg>
          </div>
          <h3 className={styles.sectionTitle}>MAÎTRES D'OUVRAGE PUBLICS</h3>
        </div>

        <div className={styles.tableContainer}>
          {publicRefs.map((ref: any) => (
            <div className={styles.tableRow} key={ref.name}>
              <div className={styles.tableIcon}>
                <svg viewBox="0 0 32 32" fill="none">
                  <path d="M8 14h10M13 6v10M18 22v6a2.5 2.5 0 01-2.5 2.5h-2.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 26h13v5a2.5 2.5 0 01-2.5 2.5h-8A2.5 2.5 0 018 31v-5z" fill="#ffffff"/>
                  <path d="M18 6h5a2.5 2.5 0 010 5h-5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className={styles.tableCell}>
                <h4 className={styles.clientName}>{ref.name}</h4>
              </div>
              <div className={styles.tableDescription}>
                <p>{ref.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M5 16h22M8 16V8a3 3 0 013-3h10a3 3 0 013 3v8M7 16v10a3 3 0 003 3h12a3 3 0 003-3V16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="16" cy="21" r="2.5" fill="#ffffff"/>
            </svg>
          </div>
          <h3 className={styles.sectionTitle}>ENTREPRISES PUBLIQUES ET PRIVÉES</h3>
        </div>

        <div className={styles.tableContainer}>
          {privateRefs.map((ref: any) => (
            <div className={styles.tableRow} key={ref.name}>
              <div className={styles.tableIcon}>
                <svg viewBox="0 0 32 32" fill="none">
                  <rect x="6" y="10" width="7" height="5" rx="1" fill="#ffffff"/>
                  <rect x="19" y="10" width="7" height="5" rx="1" fill="#ffffff"/>
                  <rect x="6" y="18" width="7" height="5" rx="1" fill="#ffffff"/>
                  <rect x="19" y="18" width="7" height="5" rx="1" fill="#ffffff"/>
                  <rect x="13" y="14" width="6" height="9" rx="1" fill="#ffffff"/>
                </svg>
              </div>
              <div className={styles.tableCell}>
                <h4 className={styles.clientName}>{ref.name}</h4>
              </div>
              <div className={styles.tableDescription}>
                <p>{ref.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div 
        className={styles.referencesFooter}
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
              <svg viewBox="0 0 40 40" fill="none">
                <path d="M20 5C15 11 11 16 11 21a9 9 0 1018 0c0-5-4-10-9-16z" fill="#ffffff" stroke="#ffffff" strokeWidth="2"/>
              </svg>
            </span>
            <span className={styles.footerLabel}>ASSAINISSEMENT</span>
          </div>
          <div className={styles.footerPillar}>
            <span className={styles.footerIcon}>
              <svg viewBox="0 0 48 40" fill="none">
                <rect x="4" y="16" width="12" height="8" rx="1" fill="#ffffff"/>
                <rect x="32" y="16" width="12" height="8" rx="1" fill="#ffffff"/>
                <rect x="16" y="6" width="6" height="10" rx="1" fill="#ffffff"/>
                <rect x="26" y="6" width="6" height="10" rx="1" fill="#ffffff"/>
                <rect x="16" y="24" width="6" height="10" rx="1" fill="#ffffff"/>
                <rect x="26" y="24" width="6" height="10" rx="1" fill="#ffffff"/>
                <circle cx="24" cy="20" r="3" fill="#ffffff"/>
              </svg>
            </span>
            <span className={styles.footerLabel}>RÉSEAUX HYDRAULIQUES</span>
          </div>
          <div className={styles.footerPillar}>
            <span className={styles.footerIcon}>
              <svg viewBox="0 0 40 40" fill="none">
                <path d="M20 10l2 1.2 2.4-.8 1.6 2 2.6.3.7 2.5 2.3 1.2-.3 2.6 2 1.6-1.2 2.4.8 2.4-2 1.6-.3 2.6-2.5.7-1.2 2.3-2.6-.3-1.6 2-2.4-1.2-2.4.8-1.6-2-2.6-.3-.7-2.5-2.3-1.2.3-2.6-2-1.6 1.2-2.4-.8-2.4 2-1.6.3-2.6 2.5-.7L12.4 10l2.6.3L20 10z" fill="#ffffff" stroke="#ffffff" strokeWidth="1.5"/>
                <circle cx="20" cy="20" r="6" fill="#031b50" stroke="#ffffff" strokeWidth="2"/>
                <circle cx="20" cy="20" r="3" fill="#ffffff"/>
              </svg>
            </span>
            <span className={styles.footerLabel}>SOLUTIONS TECHNIQUES</span>
          </div>
          <div className={styles.footerPillar}>
            <span className={styles.footerIcon}>
              <svg viewBox="0 0 40 40" fill="none">
                <path d="M20 5l14 5v10c0 9-5 15-14 19-9-4-14-10-14-19V10L20 5z" fill="#ffffff" stroke="#ffffff" strokeWidth="2"/>
                <path d="M15 20l4 4 7-7" stroke="#031b50" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className={styles.footerLabel}>DURABILITÉ & FIABILITÉ</span>
          </div>
        </div>
    
      </div>
    </section>
  )
}