'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import bgImage from '../../../images/logo2.png'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let active = true

    async function checkSession() {
      try {
        const res = await fetch('/api/admin/me', { credentials: 'include' })
        if (!active) return
        if (res.ok) {
          router.replace('/admin/dashboard')
        }
      } catch (err) {
        // Ignorer les erreurs
      }
    }

    checkSession()
    return () => {
      active = false
    }
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        const j = await res.json().catch(() => ({}))
        setError(j?.error || j?.message || 'Identifiants incorrects. Veuillez réessayer.')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur. Vérifiez votre réseau.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4 font-['DM_Sans']">
      
      {/* Carte unique : Hauteur et proportions ajustées */}
      <div className="w-full max-w-sm md:max-w-5xl xl:max-w-6xl md:min-h-[600px] md:h-[620px] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Section Gauche - Image de fond (Ajustée à 7/12 sur desktop) */}
        <div className="w-full md:w-7/12 p-6 md:p-12 flex flex-col justify-end md:justify-between relative overflow-hidden bg-slate-900 min-h-[180px] md:min-h-full">
          
          <Image 
            src={bgImage}
            alt="Fond EURL Romaïsa Liray" 
            fill
            className="object-cover z-0 opacity-80"
            priority
          />

          {/* Superposition pour préserver la lisibilité */}
          <div className="absolute inset-0 bg-black/40 z-0"></div>

          {/* Texte Bienvenue */}
          <div className="relative z-10">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-3 leading-tight drop-shadow-md">
           
            </h1>
            <p className="text-white/90 text-sm md:text-base drop-shadow">
             
            </p>
          </div>

          <div className="relative z-10"></div>
        </div>

        {/* Section Droite - Formulaire (Élargie à 5/12 sur desktop avec du padding confortable) */}
        <div className="w-full md:w-5/12 p-6 md:p-14 bg-white flex flex-col justify-center">
          <div className="w-full max-w-sm md:max-w-md mx-auto">
            
            {/* En-tête */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-1">
                Connexion
              </h2>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Champ Email */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input 
                  type="email"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 transition-all"
                  placeholder="nom@exemple.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              {/* Champ Mot de passe */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                  Mot de passe
                </label>
                <input 
                  type="password"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600 transition-all"
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3.5 rounded-xl flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Bouton */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-blue-900/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>

            </form>

          </div>
        </div>

      </div>
    </div>
  )
}