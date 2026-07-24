export const dynamic = 'force-dynamic'

import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection' // Contient maintenant "Qui sommes-nous" + "Expertise"
import ServicesSection from '../components/ServicesSection'
import ProjectsSection from '../components/ProjectsSection'
import ReferencesSection from '../components/ReferencesSection'
import ContactSection from '../components/ContactSection'

export default function Home({ searchParams }: { searchParams: { projectsPage?: string | string[]; clientsPage?: string | string[] } }) {
  const projectsPage = Number(searchParams.projectsPage ?? '1') || 1
  const clientsPage = Number(searchParams.clientsPage ?? '1') || 1

  return (
    <main>
      <Header />
      <HeroSection />
      <AboutSection />       {/* Contient maintenant "Qui sommes-nous" + "Expertise" */}
      <ServicesSection />
      <ProjectsSection projectsPage={projectsPage} clientsPage={clientsPage} />
      <ReferencesSection />
      <ContactSection />

      <footer className="site-footer">
        <div className="footer-container">
          <span>© 2026 EURL ROMAISA LIRAY</span>
          <span>Travaux d’assainissement et hydraulique</span>
        </div>
      </footer>
    </main>
  )
}