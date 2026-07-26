import Image from 'next/image'
import styles from './ReferencesSection.module.css'
import logo from '../images/Logo.svg'
import SectionTitle from './SectionTitle'
import ReferencesSectionClient from './ReferencesSectionClient'
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
        </div>
      </div>

      <ReferencesSectionClient publicRefs={publicRefs} privateRefs={privateRefs} />
    </section>
  )
}