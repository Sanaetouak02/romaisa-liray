"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type About = { id?: number; title?: string; description?: string }
type Contact = { id?: number; email?: string; address?: string; phoneNumbers?: string[] }
type AdminProfile = { id?: number; name?: string; email?: string; createdAt?: string }

const inputClass = 'w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
const textareaClass = 'w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 min-h-[110px]'
const cardClass = 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'
const buttonPrimary = 'rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700'
const buttonSecondary = 'rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50'

export default function AdminDashboardPage() {
  const [contact, setContact] = useState<Contact>({})
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [adminEmail, setAdminEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError(null)
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
    return () => {
      active = false
    }
  }, [router])

  useEffect(() => {
    if (profile) setAdminEmail(profile.email || '')
  }, [profile])


  async function saveProfile() {
    setError(null)
    const payload: any = { email: adminEmail }
    if (newPassword) payload.password = newPassword
    if (payload.password && !currentPassword) {
      setError('Le mot de passe actuel est requis pour le changement de mot de passe.')
      return
    }

    const res = await fetch('/api/admin/me', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, currentPassword }) })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setError(j?.error || 'Échec de la mise à jour du compte')
      return
    }
    const updated = await res.json()
    setProfile(updated)
    setNewPassword('')
    setCurrentPassword('')
  }

  async function saveContact() {
    setError(null)
    const payload = { email: contact.email || '', address: contact.address || '', phoneNumbers: contact.phoneNumbers || [] }
    const res = await fetch('/api/admin/contact', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setError(j?.error || 'Échec de la mise à jour des coordonnées')
      return
    }
    const updated = await res.json()
    setContact(updated)
  }

  function addPhone() {
    if (!newPhone.trim()) return
    setContact({ ...contact, phoneNumbers: [...(contact.phoneNumbers || []), newPhone.trim()] })
    setNewPhone('')
  }

  function removePhone(idx: number) {
    setContact({ ...contact, phoneNumbers: (contact.phoneNumbers || []).filter((_, i) => i !== idx) })
  }




  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    router.push('/admin/login')
  }

  const initials = (profile?.name || 'Admin').split(' ').slice(0, 2).map((part) => part[0] || '').join('').toUpperCase()

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
        Chargement du tableau de bord…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-lg font-semibold shadow-lg">
              {initials || 'A'}
            </div>
            <div>
              <p className="text-sm text-indigo-100">Compte administrateur</p>
              <h3 className="text-2xl font-semibold">{profile?.name || 'Administrateur'}</h3>
              <p className="text-sm text-indigo-100">{profile?.email || 'email non renseigné'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-indigo-50">
              Super admin
            </div>
            <button onClick={handleLogout} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
              Se déconnecter
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-100">Email</p>
            <p className="mt-1 text-sm font-medium">{profile?.email || '—'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-100">Statut</p>
            <p className="mt-1 text-sm font-medium">Accès complet</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-100">Créé le</p>
            <p className="mt-1 text-sm font-medium">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR') : '—'}</p>
          </div>
        </div>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <h4 className="mb-2 text-lg font-semibold">Gestion du compte administrateur</h4>
          <p className="text-sm text-slate-600">Modifier l'email ou le mot de passe du compte administrateur.</p>
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-sm text-slate-700">Email</label>
              <input className={inputClass} value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-slate-700">Mot de passe actuel</label>
              <input type="password" className={inputClass} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-slate-700">Nouveau mot de passe</label>
              <input type="password" className={inputClass} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <button onClick={saveProfile} className={buttonPrimary}>Enregistrer le compte</button>
              <button onClick={() => { setAdminEmail(profile?.email || ''); setCurrentPassword(''); setNewPassword('') }} className={buttonSecondary}>Réinitialiser</button>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h4 className="mb-2 text-lg font-semibold">Coordonnées publiques</h4>
          <p className="text-sm text-slate-600">Modifier l'email public, l'adresse et les numéros de téléphone affichés sur le site.</p>
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-sm text-slate-700">Email public</label>
              <input className={inputClass} value={contact.email || ''} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-slate-700">Adresse</label>
              <input className={inputClass} value={contact.address || ''} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-slate-700">Numéros de téléphone</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(contact.phoneNumbers || []).map((p, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm">
                    <span>{p}</span>
                    <button onClick={() => removePhone(i)} className="text-xs text-rose-600">Suppr</button>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input className={inputClass + ' max-w-xs'} value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Ajouter un numéro" />
                <button onClick={addPhone} className={buttonPrimary}>Ajouter</button>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={saveContact} className={buttonPrimary}>Enregistrer les coordonnées</button>
              <button onClick={() => { /* reset contact to server state */ }} className={buttonSecondary}>Annuler</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

