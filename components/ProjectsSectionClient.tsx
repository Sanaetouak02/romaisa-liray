'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FiUsers } from 'react-icons/fi'
import SectionTitle from './SectionTitle'
import styles from './ProjectsSection.module.css'

type Project = { id?: number; title?: string; description?: string; image?: string }
type Client = { id?: number; name?: string; logo?: string }

type Props = {
  projects: Project[]
  clients: Client[]
  initialProjectsPage: number
  initialClientsPage: number
}

export default function ProjectsSectionClient({
  projects,
  clients,
  initialProjectsPage,
  initialClientsPage,
}: Props) {
  const [isMobile, setIsMobile] = useState(false)
  const [projectsPage, setProjectsPage] = useState(initialProjectsPage)
  const [clientsPage, setClientsPage] = useState(initialClientsPage)
  const clientSliderRef = useRef<HTMLDivElement | null>(null)

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

  const projectsPerPage = isMobile ? 3 : 6
  const clientsPerPage = isMobile ? 3 : 6

  const pageCount = Math.max(1, Math.ceil(projects.length / projectsPerPage))
  const clientPageCount = Math.max(1, Math.ceil(clients.length / clientsPerPage))

  useEffect(() => {
    setProjectsPage((current) => Math.min(Math.max(current, 1), pageCount))
  }, [pageCount])

  useEffect(() => {
    setClientsPage((current) => Math.min(Math.max(current, 1), clientPageCount))
  }, [clientPageCount])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const anchor = document.getElementById('realisations')
    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [projectsPage])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const anchor = document.getElementById('clients')
    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [clientsPage])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('projectsPage', String(projectsPage))
    currentUrl.searchParams.set('clientsPage', String(clientsPage))
    window.history.replaceState(null, '', `${currentUrl.pathname}${currentUrl.search}`)
  }, [projectsPage, clientsPage])

  const pageProjects = useMemo(
    () => projects.slice((projectsPage - 1) * projectsPerPage, projectsPage * projectsPerPage),
    [projects, projectsPage, projectsPerPage]
  )

  const pageClients = useMemo(() => clients, [clients])

  useEffect(() => {
    const slider = clientSliderRef.current
    if (!slider) return
    const maxOffset = Math.max(slider.scrollWidth - slider.clientWidth, 0)
    const offset = Math.min((clientsPage - 1) * slider.clientWidth, maxOffset)
    slider.scrollTo({ left: offset, behavior: 'smooth' })
  }, [clientsPage])

  return (
    <section id="realisations" className={styles.projectsSection}>
      <SectionTitle eyebrow="" title="GALERIE DE RÉALISATIONS" />

      

      <div className={styles.projectsGrid}>
        {pageProjects.map((project) => (
          <article className={styles.projectCard} key={project.id ?? project.title}>
            <h3 className={styles.projectTitle}>{project.title}</h3>
            <p className={styles.projectDescription}>{project.description}</p>
            <div className={styles.projectImageWrapper}>
              {project.image ? (
                <Image src={project.image} alt={project.title ?? 'Projet'} width={200} height={150} className={styles.projectImage} />
              ) : (
                <div className={styles.projectImagePlaceholder}>Aucune image</div>
              )}
            </div>
          </article>
        ))}
      </div>

      {pageCount > 1 ? (
        <div className={styles.paginationControls}>
          <button
            type="button"
            onClick={() => setProjectsPage((page) => Math.max(page - 1, 1))}
            className={styles.paginationButton}
            disabled={projectsPage === 1}
          >
            Précédent
          </button>
          <span className={styles.paginationLabel}>
            Page {projectsPage} de {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setProjectsPage((page) => Math.min(page + 1, pageCount))}
            className={styles.paginationButton}
            disabled={projectsPage === pageCount}
          >
            Suivant
          </button>
        </div>
      ) : null}

      <div id="clients" className={styles.clientsSection}>
        <div className={styles.clientsHeader}>
          <div className={styles.clientsIcon}>
            <FiUsers size={44} color="#075bd8" />
          </div>
          <h3 className={styles.clientsTitle}>NOS CLIENTS</h3>
        </div>

        <div className={styles.clientsControls}>
          {clientPageCount > 1 ? (
            <button
              type="button"
              onClick={() => setClientsPage((page) => Math.max(page - 1, 1))}
              className={styles.arrowButton}
              disabled={clientsPage === 1}
            >
              ‹
            </button>
          ) : null}

          <div ref={clientSliderRef} className={styles.clientSlider}>
            {pageClients.map((client) => (
              <div className={styles.clientCard} key={client.id ?? client.name}>
                <div className={styles.clientLogo}>
                  <Image
                    src={client.logo ?? '/images/client-placeholder.png'}
                    alt={client.name ?? 'Client'}
                    width={80}
                    height={80}
                    className={styles.clientLogoImage}
                  />
                </div>
                <p className={styles.clientName}>{client.name}</p>
              </div>
            ))}
          </div>

          {clientPageCount > 1 ? (
            <button
              type="button"
              onClick={() => setClientsPage((page) => Math.min(page + 1, clientPageCount))}
              className={styles.arrowButton}
              disabled={clientsPage === clientPageCount}
            >
              ›
            </button>
          ) : null}
        </div>

      </div>
    </section>
  )
}
