"use client"
import React, { useEffect, useState } from 'react'

export default function AdminAccountPage() {
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/account', { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      setEmail(data.email || '')
      setName(data.name || '')
    }
    setLoading(false)
  }

  async function save() {
    setMessage('')
    const payload: any = { currentPassword }
    if (newPassword) payload.newPassword = newPassword
    if (email) payload.email = email
    if (name !== undefined) payload.name = name

    const res = await fetch('/api/admin/account', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      setMessage('Mise à jour effectuée.')
      setCurrentPassword('')
      setNewPassword('')
    } else {
      const err = await res.json().catch(() => ({}))
      setMessage(err.error || 'Erreur lors de la mise à jour.')
    }
  }

  if (loading) return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">Chargement…</div>

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-6 text-white shadow-xl">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">Administration • Mon compte</p>
        <h2 className="text-2xl font-semibold">Informations du compte admin</h2>
      </div>

      <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-indigo-100">Nom</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-indigo-100">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900" />
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-indigo-100">Mot de passe actuel</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-indigo-100">Nouveau mot de passe</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900" />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={save} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">Enregistrer</button>
        </div>

        {message ? <p className="mt-3 text-sm text-indigo-100">{message}</p> : null}
      </div>
    </div>
  )
}
