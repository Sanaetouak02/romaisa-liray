'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import logoMark from '../images/Logo.svg'

export default function AdminNav() {
  const router = useRouter()
  const pathname = usePathname()

  // Masquer la navigation sur la page de connexion
  if (!pathname || pathname.startsWith('/admin/login')) return null

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      router.push('/admin/login')
    }
  }

  const links = [
    { 
      href: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
    },
    { 
      href: '/admin/projects', 
      label: 'Réalisations', 
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' 
    },
    { 
      href: '/admin/services', 
      label: 'Services', 
      icon: 'M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z M4 20v-2a6 6 0 016-6h0a6 6 0 016 6v2' 
    },
    { 
      href: '/admin/clients', 
      label: 'Clients', 
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0z M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2' 
    },
    { 
      href: '/admin/references', 
      label: 'Références', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' 
    },
  ]

  return (
    <>
      <div className="md:hidden fixed inset-x-0 top-0 z-50 border-b border-[#075bd8]/30 bg-[#031b50]/95 text-white shadow-xl">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-3 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-3 rounded-3xl backdrop-blur-sm border border-white/10">
                <Image src={logoMark} alt="Logo admin Romaïsa Liray" width={40} height={40} className="object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-wide">ADMIN PANEL</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#71b4ff]">EURL ROMAISA LIRAY</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-2xl border border-red-500/40 bg-red-600/90 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
            >
              Déconnexion
            </button>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {links.map((l) => {
              const isActive = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex min-w-[7.5rem] items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'border-[#075bd8] bg-[#075bd8] text-white'
                      : 'border-white/10 bg-white/10 text-gray-200 hover:border-[#75abff]/50 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={l.icon} />
                  </svg>
                  <span className="truncate">{l.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-72 xl:w-80 bg-[#031b50] border-r border-[#075bd8]/30 shadow-xl z-50 flex flex-col justify-between font-['DM_Sans'] overflow-y-auto">
      
      {/* Partie supérieure : Logo & Liens */}
      <div className="flex flex-col p-5">
        
        {/* En-tête / Branding */}
        <div className="flex items-center gap-4 px-3 py-5 mb-7 border-b border-[#075bd8]/20">
          <div className="bg-white/10 p-3 rounded-3xl backdrop-blur-sm border border-white/10">
            <Image src={logoMark} alt="Logo admin Romaïsa Liray" width={40} height={40} className="object-contain" />
            <h1 className="text-white text-2xl font-semibold tracking-wider">ADMIN PANEL</h1>
            <p className="text-[#71b4ff] text-xs uppercase tracking-[0.35em] mt-1">EURL ROMAISA LIRAY</p>
          </div>
        </div>

        {/* Liens de navigation */}
        <nav className="flex flex-col gap-3">
          {links.map((l) => {
            const isActive = pathname === l.href
            return (
              <Link 
                key={l.href} 
                href={l.href} 
                className={`flex items-center gap-4 rounded-3xl px-5 py-4 text-base font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#075bd8] text-white shadow-[0_10px_30px_rgba(7,91,216,0.18)]' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={l.icon} />
                </svg>
                <span>{l.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Partie inférieure : Bouton Déconnexion fixé en bas */}
      <div className="p-4 border-t border-[#075bd8]/20 bg-[#02133b]">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-red-600/90 hover:bg-red-600 rounded-xl transition-all shadow-md border border-red-500/50 hover:shadow-red-600/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Déconnexion</span>
        </button>
      </div>

    </aside>
    </>
  )
}