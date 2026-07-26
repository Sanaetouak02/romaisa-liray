import ProjectsSectionClient from './ProjectsSectionClient'
import prisma from '../lib/prisma'

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

  const serializableProjects = projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    image: project.image,
  }))

  const serializableClients = clients.map((client) => ({
    id: client.id,
    name: client.name,
    logo: client.logo,
  }))

  return (
    <ProjectsSectionClient
      projects={serializableProjects}
      clients={serializableClients}
      initialProjectsPage={projectsPage}
      initialClientsPage={clientsPage}
    />
  )
}
