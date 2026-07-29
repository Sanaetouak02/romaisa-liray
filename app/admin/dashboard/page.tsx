'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { showNotification } from '../../../components/AdminNotification'

type Contact = { id?: number; email?: string; address?: string; phoneNumbers?: string[] }
type AdminProfile = { id?: number; name?: string; email?: string; createdAt?: string }

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
const cardClass = 'rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all hover:shadow-md w-full'
const buttonPrimary = 'rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-sm shadow-indigo-200 active:scale-[0.99]'
const buttonSecondary = 'rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'

export default function AdminDashboardPage() {
  const [contact, setContact] = useState<Contact>({})
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [adminEmail, setAdminEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      const [cRes, mRes] = await Promise.all([
        fetch('/api/admin/contact', { credentials: 'include' }),
        fetch('/api/admin/me', { credentials: 'include' }),
      ])

      if (!active) return

      if (cRes.status === 401 || mRes.status === 401) {
        router.push('/admin/login')
        return
      }

      if (cRes.ok) setContact(await cRes.json())
      if (mRes.ok) setProfile(await mRes.json())
      setLoading(false)
    }

    load()
    return () => { active = false }
  }, [router])

  useEffect(() => {
    if (profile) setAdminEmail(profile.email || '')
  }, [profile])

  async function saveProfile() {
    const payload: any = { email: adminEmail }
    if (newPassword) payload.password = newPassword
    if (payload.password && !currentPassword) {
      showNotification('Le mot de passe actuel est requis pour le changement de mot de passe.', 'error')
      return
    }

    const res = await fetch('/api/admin/me', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, currentPassword }) })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      showNotification(j?.error || 'Échec de la mise à jour du compte', 'error')
      return
    }
    const updated = await res.json()
    setProfile(updated)
    setNewPassword('')
    setCurrentPassword('')
    showNotification('Profil mis à jour avec succès.', 'success')
  }

  async function saveContact() {
    const payload = { email: contact.email || '', address: contact.address || '', phoneNumbers: contact.phoneNumbers || [] }
    const res = await fetch('/api/admin/contact', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      showNotification(j?.error || 'Échec de la mise à jour des coordonnées', 'error')
      return
    }
    const updated = await res.json()
    setContact(updated)
    showNotification('Coordonnées sauvegardées avec succès.', 'success')
  }

  function addPhone() {
    if (!newPhone.trim()) {
      showNotification('Veuillez entrer un numéro de téléphone.', 'error')
      return
    }
    setContact({ ...contact, phoneNumbers: [...(contact.phoneNumbers || []), newPhone.trim()] })
    setNewPhone('')
    showNotification('Numéro de téléphone ajouté.', 'success')
  }

  function removePhone(idx: number) {
    setContact({ ...contact, phoneNumbers: (contact.phoneNumbers || []).filter((_, i) => i !== idx) })
    showNotification('Numéro de téléphone supprimé.', 'success')
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    router.push('/admin/login')
  }

  const initials = (profile?.name || 'Admin').split(' ').slice(0, 2).map((part) => part[0] || '').join('').toUpperCase()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Chargement du tableau de bord…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-8 font-['DM_Sans']">
      
      <div className="flex flex-col gap-1 w-full">
        <h1 className="text-3xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-sm text-slate-500">Gérez vos paramètres d'administration et vos coordonnées publiques.</p>
      </div>

      <div className="w-full rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold text-white shadow-inner border border-white/20">
              {initials || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Compte administrateur</p>
              </div>
              <h2 className="text-2xl font-bold">{profile?.name || 'Administrateur'}</h2>
              <p className="text-sm text-slate-300">{profile?.email || 'email non renseigné'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-indigo-100 backdrop-blur-sm">
              Super admin
            </span>
            <button 
              onClick={handleLogout} 
              className="rounded-xl border border-rose-500/30 bg-rose-500/20 px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/30 active:scale-95"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3 border-t border-white/10 pt-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-widest text-indigo-200 font-medium">Adresse Email</p>
            <p className="mt-1 text-sm font-semibold truncate text-white">{profile?.email || '—'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-widest text-indigo-200 font-medium">Niveau d'accès</p>
            <p className="mt-1 text-sm font-semibold text-emerald-400 flex items-center gap-1.5">Accès complet</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-widest text-indigo-200 font-medium">Membre depuis</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 w-full">
        
        <div className={cardClass}>
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Sécurité du Compte</h3>
              <p className="text-xs text-slate-500">Mettez à jour vos identifiants d'accès au panneau d'administration.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Adresse email de connexion</label>
              <input className={inputClass} value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@exemple.com" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Mot de passe actuel</label>
                <input type="password" className={inputClass} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Nouveau mot de passe</label>
                <input type="password" className={inputClass} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button onClick={() => { setAdminEmail(profile?.email || ''); setCurrentPassword(''); setNewPassword('') }} className={buttonSecondary}>Réinitialiser</button>
              <button onClick={saveProfile} className={buttonPrimary}>Enregistrer le compte</button>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Coordonnées Publiques</h3>
              <p className="text-xs text-slate-500">Informations affichées sur la page de contact de votre site internet.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Email public de contact</label>
              <input className={inputClass} value={contact.email || ''} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="contact@entreprise.com" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Adresse physique</label>
              <input className={inputClass} value={contact.address || ''} onChange={(e) => setContact({ ...contact, address: e.target.value })} placeholder="Adresse complète..." />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Numéros de téléphone</label>
              
              <div className="flex flex-wrap gap-2 mb-3 min-h-[38px] p-2 bg-slate-50 rounded-2xl border border-slate-100">
                {(contact.phoneNumbers || []).length === 0 ? (
                  <span className="text-xs text-slate-400 self-center px-2">Aucun numéro enregistré.</span>
                ) : (
                  (contact.phoneNumbers || []).map((p, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                      <span>{p}</span>
                      <button onClick={() => removePhone(i)} className="text-rose-500 hover:text-rose-700 font-bold ml-1 transition">✕</button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <input className={inputClass} value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+213..." />
                <button onClick={addPhone} className={buttonSecondary}>Ajouter</button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button onClick={saveContact} className={buttonPrimary}>Enregistrer les coordonnées</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
