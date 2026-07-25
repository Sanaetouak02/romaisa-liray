import Image from 'next/image'
import { FiUsers } from 'react-icons/fi'
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

  return (
    <section id="realisations" className={styles.projectsSection}>
      {/* Header avec SectionTitle comme les autres sections */}
      <SectionTitle 
        eyebrow="EURL ROMAISA LIRAY" 
        title="GALERIE DE RÉALISATIONS" 
      />

      <p className="text-base text-slate-600">{`Nombre de réalisations trouvées : ${totalProjects}`}</p>

      {/* Grille des projets */}
      <div className={styles.projectsGrid}>
        {pageProjects.map((project) => (
          <article className={styles.projectCard} key={project.id ?? project.title}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
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
            <FiUsers size={44} color="#075bd8" />
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