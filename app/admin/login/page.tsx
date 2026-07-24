"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
// Assurez-vous que le chemin vers votre logo est correct
import logoMark from '../../../images/Logo.svg'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@romaisa.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f4f7fc] to-[#e2ebfa] p-4 font-['DM_Sans']">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* En-tête avec Logo */}
        <div className="bg-[#031b50] p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#075bd8]/20 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white p-3 rounded-full shadow-lg mb-4">
              <Image 
                src={logoMark} 
                alt="Logo EURL Romaïsa Liray" 
                width={56} 
                height={56} 
                className="object-contain"
              />
            </div>
            <h2 className="font-['Bebas_Neue'] text-3xl text-white tracking-wider mb-1">
              ESPACE ADMIN
            </h2>
            <p className="text-[#71b4ff] text-sm font-semibold tracking-wide uppercase">
              EURL ROMAISA LIRAY
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Champ Email */}
            <div>
              <label className="block text-sm font-bold text-[#031b50] mb-1.5">
                Adresse E-mail
              </label>
              <input 
                type="email"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#075bd8]/40 focus:border-[#075bd8] transition-all"
                placeholder="admin@romaisa.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-sm font-bold text-[#031b50] mb-1.5">
                Mot de passe
              </label>
              <input 
                type="password"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#075bd8]/40 focus:border-[#075bd8] transition-all"
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Bouton de soumission */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#0789fb] to-[#075bd8] text-white font-bold py-3.5 px-4 rounded-lg hover:from-[#075bd8] hover:to-[#031b50] transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

          {/* Pied de carte */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              © 2026 EURL ROMAISA LIRAY. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}