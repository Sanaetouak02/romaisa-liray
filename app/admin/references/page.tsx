"use client"
import React, { useEffect, useState } from 'react'

type Reference = { id?: number; name: string; description: string; category?: string }

export default function AdminReferencesPage() {
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Reference>>({ name: '', description: '', category: 'Public' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Partial<Reference>>({})
  const [message, setMessage] = useState('')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/references', { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) {
        setReferences(data)
      } else {
        setReferences([])
      }
    } else {
      setReferences([])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function create() {
    setMessage('')
    const res = await fetch('/api/admin/references', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      await load()
      setForm({ name: '', description: '', category: 'Public' })
      setMessage('Référence ajoutée.')
    } else {
      setMessage('Échec de l’ajout de la référence.')
    }
  }

  async function update(reference: Reference) {
    setMessage('')
    const res = await fetch(`/api/admin/references/${reference.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reference),
    })
    if (res.ok) {
      await load()
      setEditingId(null)
      setDraft({})
      setMessage('Référence mise à jour.')
    } else {
      setMessage('Échec de la modification de la référence.')
    }
  }

  async function remove(id?: number) {
    if (!id) return
    if (!confirm('Supprimer cette référence ?')) return
    const res = await fetch(`/api/admin/references/${id}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) {
      await load()
      setMessage('Référence supprimée.')
    }
  }

  if (loading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">Chargement…</div>
  }

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-800 p-6 text-white shadow-xl">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">Administration • Références clients</p>
        <h2 className="text-2xl font-semibold">Gestion des références clients</h2>
        <p className="text-sm text-indigo-100">Les références affichées sont des maîtres d’ouvrage publics et des entreprises.</p>
      </div>

      <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-indigo-100">Nom</label>
            <input
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300"
              placeholder="Nom du client"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-indigo-100">Type</label>
            <select
              value={form.category || 'Public'}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300"
            >
              <option value="Public">Public</option>
              <option value="Entreprise">Entreprise</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="mb-1 block text-sm font-medium text-indigo-100">Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="min-h-[120px] w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300"
              placeholder="Description détaillée"
            />
          </div>
          <div className="md:col-span-3">
            <button onClick={create} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              Ajouter une référence
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {references.length === 0 ? (
          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 text-sm text-indigo-100">Aucune référence trouvée dans la base de données.</div>
        ) : null}
        {references.map((reference) => (
          <div key={reference.id || reference.name} className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            {editingId === reference.id ? (
              <div className="space-y-3">
                <input
                  value={draft.name || ''}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300"
                />
                <select
                  value={draft.category || 'Public'}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300"
                >
                  <option value="Public">Public</option>
                  <option value="Entreprise">Entreprise</option>
                </select>
                <textarea
                  value={draft.description || ''}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  className="min-h-[120px] w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300"
                />
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => update({ ...reference, name: draft.name || reference.name, category: draft.category || reference.category, description: draft.description || reference.description })} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                    Enregistrer
                  </button>
                  <button onClick={() => { setEditingId(null); setDraft({}) }} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20">
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{reference.name}</h3>
                  <p className="mt-1 text-sm text-indigo-100">{reference.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setEditingId(reference.id ?? null); setDraft({ name: reference.name, description: reference.description, category: reference.category }) }} className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                    Modifier
                  </button>
                  <button onClick={() => remove(reference.id)} className="rounded-2xl border border-rose-300/30 bg-rose-500/15 px-3 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/25">
                    Supprimer
                  </button>
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
