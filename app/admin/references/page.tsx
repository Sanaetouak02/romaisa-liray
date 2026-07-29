"use client"
import React, { useEffect, useState } from 'react'
import { showNotification } from '../../../components/AdminNotification'

type Reference = { id?: number; name: string; description: string; category?: string }

export default function AdminReferencesPage() {
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Reference>>({ name: '', description: '', category: 'Public' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Partial<Reference>>({})
  const [search, setSearch] = useState('')

  const publicReferences = references.filter((reference) => (reference.category || 'Public') === 'Public')
  const enterpriseReferences = references.filter((reference) => (reference.category || 'Public') === 'Entreprise')
  const totalPublic = publicReferences.length
  const totalEnterprise = enterpriseReferences.length

  async function load(query = '') {
    setLoading(true)
    const url = new URL('/api/admin/references', window.location.origin)
    if (query) url.searchParams.set('q', query)
    const res = await fetch(url.toString(), { credentials: 'include' })
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
    const res = await fetch('/api/admin/references', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      await load()
      setForm({ name: '', description: '', category: 'Public' })
      showNotification('Référence ajoutée avec succès.', 'success')
    } else {
      showNotification('Échec de l\'ajout de la référence.', 'error')
    }
  }

  async function update(reference: Reference) {
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
      showNotification('Référence mise à jour avec succès.', 'success')
    } else {
      showNotification('Échec de la modification de la référence.', 'error')
    }
  }

  async function remove(id?: number) {
    if (!id) return
    if (!confirm('Supprimer cette référence ?')) return
    const res = await fetch(`/api/admin/references/${id}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) {
      await load()
      showNotification('Référence supprimée.', 'success')
    } else {
      showNotification('Échec de la suppression de la référence.', 'error')
    }
  }

  const [showForm, setShowForm] = useState(false)

  if (loading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">Chargement…</div>
  }

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-800 p-6 text-white shadow-xl">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">Administration • Références</p>
        <h2 className="text-2xl font-semibold">Gestion des références</h2>
        <p className="text-sm text-indigo-100">Sépare les références publiques et entreprises dans deux tableaux.</p>
        <div className="flex flex-wrap gap-3 text-sm text-indigo-100">
          <span className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2">Public : {totalPublic}</span>
          <span className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2">Entreprise : {totalEnterprise}</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une référence..."
            className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900"
          />
          <button type="button" onClick={() => load(search)} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">Rechercher</button>
          <button type="button" onClick={() => { setSearch(''); load('') }} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">Effacer</button>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={() => setShowForm((prev) => !prev)} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">
          {showForm ? 'Masquer le formulaire' : 'Ajouter une référence'}
        </button>
      </div>
      {showForm ? (
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
            <div className="md:col-span-3 flex flex-wrap gap-3">
              <button onClick={create} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Ajouter une référence
              </button>
              <button onClick={() => setForm({ name: '', description: '', category: 'Public' })} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20">
                Effacer
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6">
        {references.length === 0 ? (
          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 text-sm text-indigo-100">Aucune référence trouvée dans la base de données.</div>
        ) : null}

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Clients publics</h3>
                <p className="text-sm text-indigo-100">Total : {totalPublic}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {publicReferences.map((reference) => (
                <div key={reference.id || reference.name} className="rounded-3xl border border-white/15 bg-slate-950/50 p-4">
                  {editingId === reference.id ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          value={draft.name || ''}
                          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                          className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2 text-sm text-slate-900"
                          placeholder="Nom"
                        />
                        <select
                          value={draft.category || reference.category || 'Public'}
                          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                          className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2 text-sm text-slate-900"
                        >
                          <option value="Public">Public</option>
                          <option value="Entreprise">Entreprise</option>
                        </select>
                      </div>
                      <textarea
                        value={draft.description || ''}
                        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                        className="min-h-[90px] w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2 text-sm text-slate-900"
                        placeholder="Description"
                      />
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => update({
                            id: reference.id,
                            name: draft.name || reference.name,
                            description: draft.description || reference.description,
                            category: draft.category || reference.category,
                          })}
                          className="w-full rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 sm:w-auto"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setDraft({}) }}
                          className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white sm:w-auto"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h4 className="text-base font-semibold">{reference.name}</h4>
                        <p className="mt-1 text-sm text-indigo-100">{reference.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(reference.id ?? null); setDraft({ name: reference.name, description: reference.description, category: reference.category }) }} className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white">Modifier</button>
                        <button onClick={() => remove(reference.id)} className="rounded-2xl border border-rose-300/30 bg-rose-500/15 px-3 py-2 text-sm font-semibold text-rose-100">Supprimer</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Entreprises</h3>
                <p className="text-sm text-indigo-100">Total : {totalEnterprise}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {enterpriseReferences.map((reference) => (
                <div key={reference.id || reference.name} className="rounded-3xl border border-white/15 bg-slate-950/50 p-4">
                  {editingId === reference.id ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          value={draft.name || ''}
                          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                          className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2 text-sm text-slate-900"
                          placeholder="Nom"
                        />
                        <select
                          value={draft.category || reference.category || 'Public'}
                          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                          className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2 text-sm text-slate-900"
                        >
                          <option value="Public">Public</option>
                          <option value="Entreprise">Entreprise</option>
                        </select>
                      </div>
                      <textarea
                        value={draft.description || ''}
                        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                        className="min-h-[90px] w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2 text-sm text-slate-900"
                        placeholder="Description"
                      />
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => update({
                            id: reference.id,
                            name: draft.name || reference.name,
                            description: draft.description || reference.description,
                            category: draft.category || reference.category,
                          })}
                          className="w-full rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 sm:w-auto"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setDraft({}) }}
                          className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white sm:w-auto"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h4 className="text-base font-semibold">{reference.name}</h4>
                        <p className="mt-1 text-sm text-indigo-100">{reference.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(reference.id ?? null); setDraft({ name: reference.name, description: reference.description, category: reference.category }) }} className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white">Modifier</button>
                        <button onClick={() => remove(reference.id)} className="rounded-2xl border border-rose-300/30 bg-rose-500/15 px-3 py-2 text-sm font-semibold text-rose-100">Supprimer</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
