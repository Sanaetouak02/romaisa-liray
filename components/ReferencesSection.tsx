import Image from 'next/image'
import { FiBriefcase, FiUsers, FiCheckCircle } from 'react-icons/fi'
import styles from './ReferencesSection.module.css'
import logo from '../images/Logo.svg'
import heroImage from '../pic/Pic3.png'
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
          <p className="text-base text-slate-600">{`Total références en base : ${totalRefs}`}</p>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <FiBriefcase size={28} color="#ffffff" />
          </div>
          <h3 className={styles.sectionTitle}>MAÎTRES D'OUVRAGE PUBLICS</h3>
        </div>

        <div className={styles.tableContainer}>
          {publicRefs.map((ref: any) => (
            <div className={styles.tableRow} key={ref.name}>
              <div className={styles.tableIcon}>
                <FiCheckCircle size={22} color="#ffffff" />
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
            <FiUsers size={28} color="#ffffff" />
          </div>
          <h3 className={styles.sectionTitle}>ENTREPRISES PUBLIQUES ET PRIVÉES</h3>
        </div>

        <div className={styles.tableContainer}>
          {privateRefs.map((ref: any) => (
            <div className={styles.tableRow} key={ref.name}>
              <div className={styles.tableIcon}>
                <FiCheckCircle size={22} color="#ffffff" />
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

      
    </section>
  )
}