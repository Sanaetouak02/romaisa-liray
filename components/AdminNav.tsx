"use client"

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminNav() {
  const router = useRouter()
  const pathname = usePathname()

  // Hide the admin nav on the login page
  if (!pathname) return null
  if (pathname.startsWith('/admin/login')) return null

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
    <nav className="bg-[#031b50] border-b border-[#075bd8]/30 shadow-lg sticky top-0 z-50 font-['DM_Sans']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10">
              <svg className="w-5 h-5 text-[#71b4ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-['Bebas_Neue'] text-xl tracking-wider leading-none">
                ADMIN PANEL
              </h1>
              <p className="text-[#71b4ff] text-[10px] font-bold tracking-widest uppercase">
                EURL ROMAISA LIRAY
              </p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((l) => {
              const isActive = pathname === l.href
              return (
                <Link 
                  key={l.href} 
                  href={l.href} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#075bd8] text-white shadow-md shadow-[#075bd8]/30' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={l.icon} />
                  </svg>
                  {l.label}
                </Link>
              )
            })}
          </div>

          {/* Logout Button */}
          <div className="flex items-center">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600/90 hover:bg-red-600 rounded-md transition-all shadow-sm border border-red-500/50 hover:shadow-red-600/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (Horizontal Scroll) */}
      <div className="md:hidden border-t border-[#075bd8]/30 overflow-x-auto scrollbar-hide">
        <div className="flex px-4 py-3 space-x-2 min-w-max">
          {links.map((l) => {
            const isActive = pathname === l.href
            return (
              <Link 
                key={l.href} 
                href={l.href} 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-[#075bd8] text-white shadow-sm' 
                    : 'text-gray-300 bg-white/5 border border-white/10'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={l.icon} />
                </svg>
                {l.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}