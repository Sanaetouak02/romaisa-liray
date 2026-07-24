"use client"
import React, { useEffect, useState } from 'react'

type Service = { id?: number; number: string; title: string; description: string; icon?: string; image?: string }

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Service>>({ number: '', title: '', description: '', icon: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Partial<Service>>({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/services', { credentials: 'include' })
    if (res.ok) setServices(await res.json())
    setLoading(false)
  }

  async function create() {
    setMessage('')
    const payload = { number: form.number?.trim(), title: form.title?.trim(), description: form.description?.trim(), icon: form.icon, image: form.image }
    const res = await fetch('/api/admin/services', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      const added = await res.json()
      setServices([added, ...services])
      setForm({ number: '', title: '', description: '', icon: '' })
      setMessage('Service ajouté.')
    } else {
      setMessage('Erreur lors de l\'ajout.')
    }
  }

  async function update(item: Service) {
    setMessage('')
    const res = await fetch(`/api/admin/services/${item.id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
    if (res.ok) {
      const updated = await res.json()
      setServices(services.map((s) => (s.id === updated.id ? updated : s)))
      setEditingId(null)
      setDraft({})
      setMessage('Modifié.')
    } else {
      setMessage('Erreur lors de la modification.')
    }
  }

  async function remove(id?: number) {
    if (!id) return
    if (!confirm('Supprimer ce service ?')) return
    const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) {
      setServices(services.filter((s) => s.id !== id))
      setMessage('Supprimé.')
    }
  }

  if (loading) return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">Chargement…</div>

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-800 p-6 text-white shadow-xl">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">Administration • Services</p>
      </div>

      <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-indigo-100">Numéro</label>
            <input value={form.number || ''} onChange={(e) => setForm({ ...form, number: e.target.value })} className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-indigo-100">Titre</label>
            <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-indigo-100">Icône</label>
            <select value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900">
              <option value="">Standard (auto)</option>
              <option value="drop">Assainissement</option>
              <option value="faucet">Plomberie</option>
              <option value="tools">Maintenance</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-sm font-medium text-indigo-100">Description</label>
          <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[80px] w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900" />
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={create} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">Ajouter</button>
          <button onClick={() => setForm({ number: '', title: '', description: '', icon: '' })} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">Effacer</button>
        </div>
      </div>

      <div className="grid gap-3">
        {services.map((s) => (
          <div key={s.id} className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            {editingId === s.id ? (
              <div className="space-y-3">
                <input value={draft.number || ''} onChange={(e) => setDraft({ ...draft, number: e.target.value })} className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900" />
                <input value={draft.title || ''} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900" />
                <div>
                  <label className="mb-1 block text-sm font-medium text-indigo-100">Icône</label>
                  <select value={draft.icon || ''} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900">
                    <option value="">Standard (auto)</option>
                    <option value="drop">Assainissement</option>
                    <option value="faucet">Plomberie</option>
                    <option value="tools">Maintenance</option>
                  </select>
                </div>
                <textarea value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="min-h-[80px] w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900" />
                <div className="flex gap-3">
                  <button onClick={() => update({ ...(s as Service), number: draft.number || s.number, title: draft.title || s.title, description: draft.description || s.description, icon: draft.icon || s.icon })} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">Enregistrer</button>
                  <button onClick={() => { setEditingId(null); setDraft({}) }} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">Annuler</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 text-sm text-indigo-100">#{s.number}</div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-indigo-100">{s.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(s.id ?? null); setDraft({ number: s.number, title: s.title, description: s.description, icon: s.icon }) }} className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white">Modifier</button>
                  <button onClick={() => remove(s.id)} className="rounded-2xl border border-rose-300/30 bg-rose-500/15 px-3 py-2 text-sm font-semibold text-rose-100">Supprimer</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {message ? <p className="text-sm text-indigo-100">{message}</p> : null}
    </div>
  )
}
