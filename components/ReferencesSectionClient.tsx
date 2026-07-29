'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { FiBriefcase, FiUsers, FiCheckCircle } from 'react-icons/fi'
import styles from './ReferencesSection.module.css'

type Reference = {
  id?: number
  name: string
  description?: string
}

type Props = {
  publicRefs: Reference[]
  privateRefs: Reference[]
}

function ReferencesTable({
  title,
  Icon,
  references,
}: {
  title: string
  Icon: typeof FiBriefcase
  references: Reference[]
}) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  )
  const [page, setPage] = useState(1)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const updateMobile = () => setIsMobile(mediaQuery.matches)
    updateMobile()
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMobile)
    } else {
      mediaQuery.addListener(updateMobile)
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateMobile)
      } else {
        mediaQuery.removeListener(updateMobile)
      }
    }
  }, [])

  const refsPerPage = isMobile ? 3 : 6
  const pageCount = Math.max(1, Math.ceil(references.length / refsPerPage))

  useEffect(() => {
    setPage((current) => Math.min(Math.max(current, 1), pageCount))
  }, [pageCount])

  const pageRefs = useMemo(
    () => references.slice((page - 1) * refsPerPage, page * refsPerPage),
    [references, page, refsPerPage]
  )

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>
          <Icon size={28} color="#ffffff" />
        </div>
        <h3 className={styles.sectionTitle}>{title}</h3>
      </div>

      <div className={styles.tableContainer}>
        {pageRefs.map((ref) => (
          <div className={styles.tableRow} key={ref.id ?? ref.name}>
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

      {pageCount > 1 ? (
        <div className={styles.paginationControls}>
          <button
            type="button"
            className={styles.paginationButton}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            disabled={page === 1}
          >
            Précédent
          </button>
          <span className={styles.paginationLabel}>
            Page {page} / {pageCount}
          </span>
          <button
            type="button"
            className={styles.paginationButton}
            onClick={() => setPage((current) => Math.min(current + 1, pageCount))}
            disabled={page === pageCount}
          >
            Suivant
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default function ReferencesSectionClient({ publicRefs, privateRefs }: Props) {
  return (
    <>
      <ReferencesTable title="MAÎTRES D'OUVRAGE PUBLICS" Icon={FiBriefcase} references={publicRefs} />
      <ReferencesTable title="ENTREPRISES PUBLIQUES ET PRIVÉES" Icon={FiUsers} references={privateRefs} />
    </>
  )
}
