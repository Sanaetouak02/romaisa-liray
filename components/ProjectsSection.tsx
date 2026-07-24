import Image from 'next/image'
import SectionTitle from './SectionTitle'
import styles from './ProjectsSection.module.css'
import heroImage from '../images/hero-background.png'
import prisma from '../lib/prisma'

const PROJECTS_PER_PAGE = 6
const CLIENTS_PER_PAGE = 6

export default async function ProjectsSection({ projectsPage, clientsPage }: { projectsPage: number; clientsPage: number }) {
  let projects: any[] = []
  let clients: any[] = []
  try {
    projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
    clients = await prisma.client.findMany()
  } catch (err) {
    // Log and continue with empty arrays when DB is unreachable during dev
    // eslint-disable-next-line no-console
    console.error('Prisma error in ProjectsSection:', err)
    projects = []
    clients = []
  }
  const pageCount = Math.max(1, Math.ceil(projects.length / PROJECTS_PER_PAGE))
  const clientPageCount = Math.max(1, Math.ceil(clients.length / CLIENTS_PER_PAGE))
  const currentProjectsPage = Math.min(Math.max(projectsPage, 1), pageCount)
  const currentClientsPage = Math.min(Math.max(clientsPage, 1), clientPageCount)
  const pageProjects = projects.slice((currentProjectsPage - 1) * PROJECTS_PER_PAGE, currentProjectsPage * PROJECTS_PER_PAGE)
  const pageClients = clients.slice((currentClientsPage - 1) * CLIENTS_PER_PAGE, currentClientsPage * CLIENTS_PER_PAGE)
  // Defensive: ensure arrays
  const totalProjects = projects.length || 0
  const totalClients = clients.length || 0

function ProjectIcon({ name }: { name: string }) {
  if (name === 'pompage' || name.toLowerCase() === 'pompage') {
    return (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" fill="#075bd8"/>
        <path d="M18 28v-8a6 6 0 1112 0v8" stroke="#ffffff" strokeWidth="3" strokeLinecap="round"/>
        <rect x="20" y="28" width="8" height="6" fill="#ffffff"/>
        <path d="M16 34h16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
  if (name === 'network') {
    return (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" fill="#075bd8"/>
        <path d="M16 24h16M24 16v16" stroke="#ffffff" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="4" fill="#ffffff"/>
      </svg>
    )
  }
  if (name === 'water') {
    return (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" fill="#075bd8"/>
        <path d="M24 16c-4 5-7 9-7 13a7 7 0 1014 0c0-4-3-8-7-13z" fill="#ffffff"/>
      </svg>
    )
  }
  if (name === 'industrial') {
    return (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" fill="#075bd8"/>
        <path d="M24 16l3 2 4-1 2 3 4 .5 .5 4 3 1.5-.5 4 2.5 2-1.5 3 1 4-3.5 1-1 3.5-4-1-2 3-3-1.5-3 1.5-2-3-4 1-1-3.5-3.5-1 1-4-2.5-2 .5-4 3-1.5.5-4 4-.5 2-3 4 1z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="24" r="6" fill="#ffffff"/>
      </svg>
    )
  }
  if (name === 'maintenance') {
    return (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" fill="#075bd8"/>
        <path d="M18 30l12-12M30 30L18 18" stroke="#ffffff" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="18" cy="18" r="4" stroke="#ffffff" strokeWidth="2"/>
        <circle cx="30" cy="30" r="4" stroke="#ffffff" strokeWidth="2"/>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" fill="#075bd8"/>
      <path d="M18 24c0-4 3-7 6-7s6 3 6 7v6H18v-6z" fill="#ffffff"/>
      <rect x="16" y="30" width="16" height="4" rx="1" fill="#ffffff"/>
    </svg>
  )
}

  return (
    <section id="realisations" className={styles.projectsSection}>
      {/* Header avec SectionTitle comme les autres sections */}
      <SectionTitle 
        eyebrow="EURL ROMAISA LIRAY" 
        title="GALERIE DE RÉALISATIONS" 
      />

      <p className="text-sm text-indigo-100">{`Nombre de réalisations trouvées : ${totalProjects}`}</p>

      {/* Grille des projets */}
      <div className={styles.projectsGrid}>
        {pageProjects.map((project) => (
          <article className={styles.projectCard} key={project.id ?? project.title}>
            <div className={styles.cardHeader}>
              <div className={styles.projectIcon}>
                <ProjectIcon name={project.category ?? 'default'} />
              </div>
              <h3 className={styles.projectTitle}>{project.title}</h3>
            </div>
            <p className={styles.projectDescription}>{project.description}</p>
            <div className={styles.projectImageWrapper}>
              {project.image ? (
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  width={200} 
                  height={150} 
                  className={styles.projectImage}
                />
              ) : (
                <div className={styles.projectImagePlaceholder}>Aucune image</div>
              )}
            </div>
          </article>
        ))}
      </div>

      {pageCount > 1 ? (
        <div className={styles.paginationControls}>
          <a
            className={styles.paginationButton}
            href={`/?projectsPage=${Math.max(currentProjectsPage - 1, 1)}&clientsPage=${currentClientsPage}`}
            aria-label="Page précédente"
          >
            Précédent
          </a>
          <span className={styles.paginationLabel}>Page {currentProjectsPage} de {pageCount}</span>
          <a
            className={styles.paginationButton}
            href={`/?projectsPage=${Math.min(currentProjectsPage + 1, pageCount)}&clientsPage=${currentClientsPage}`}
            aria-label="Page suivante"
          >
            Suivant
          </a>
        </div>
      ) : null}

      {/* Section Nos Clients */}
      <div className={styles.clientsSection}>
        <div className={styles.clientsHeader}>
          <div className={styles.clientsIcon}>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 10l3 2 5-1 2 4 4 .5 .5 4 3 1.5-.5 4 2.5 2-1.5 3 1 4-3.5 1-1 3.5-4-1-2 3-3-1.5-3 1.5-2-3-4 1-1-3.5-3.5-1 1-4-2.5-2 .5-4 3-1.5.5-4 4-.5 2-3 4 1z" fill="#075bd8"/>
              <circle cx="20" cy="20" r="8" fill="#ffffff"/>
              <path d="M16 20h8M20 16v8" stroke="#075bd8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className={styles.clientsTitle}>NOS CLIENTS</h3>
        </div>

        <div className={styles.clientsControls}>
        {clientPageCount > 1 ? (
          <a
            className={styles.arrowButton}
            href={`/?projectsPage=${currentProjectsPage}&clientsPage=${Math.max(currentClientsPage - 1, 1)}`}
            aria-label="Clients précédent"
          >
            ‹
          </a>
        ) : null}
        <div className={styles.clientSlider}>
          {pageClients.map((client) => (
            <div className={styles.clientCard} key={client.id ?? client.name}>
              <div className={styles.clientLogo}>
                <Image 
                  src={client.logo ?? '/images/client-placeholder.png'} 
                  alt={client.name}
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
          <a
            className={styles.arrowButton}
            href={`/?projectsPage=${currentProjectsPage}&clientsPage=${Math.min(currentClientsPage + 1, clientPageCount)}`}
            aria-label="Clients suivant"
          >
            ›
          </a>
        ) : null}
      </div>
      {clientPageCount > 1 ? (
        <div className={styles.paginationControls}>
          <span className={styles.paginationLabel}>Page clients {currentClientsPage} de {clientPageCount}</span>
        </div>
      ) : null}
      </div>

     
    </section>
  )
}