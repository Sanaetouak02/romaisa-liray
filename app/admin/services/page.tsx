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
  const [search, setSearch] = useState('')
  const totalServices = services.length
  const lastServiceNumber = services.length
    ? [...services].sort((a, b) => Number(a.number) - Number(b.number))[services.length - 1]?.number
    : '00'

  useEffect(() => {
    load()
  }, [])

  async function uploadFileDataURL(filename: string, dataURL: string) {
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename, data: dataURL }) })
      if (!res.ok) throw new Error('Upload failed')
      const json = await res.json()
      return json.url as string
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Upload error', err)
      return null
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const dataURL = String(reader.result || '')
      const url = await uploadFileDataURL(file.name, dataURL)
      if (url) setForm({ ...form, image: url })
    }
    reader.readAsDataURL(file)
  }

  async function handleEditFileChange(e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<Partial<Service>>>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const dataURL = String(reader.result || '')
      const url = await uploadFileDataURL(file.name, dataURL)
      if (url) setter((prev: Partial<Service>) => ({ ...(prev as Partial<Service>), image: url }))
    }
    reader.readAsDataURL(file)
  }

  async function load(query = '') {
    setLoading(true)
    const url = new URL('/api/admin/services', window.location.origin)
    if (query) url.searchParams.set('q', query)
    const res = await fetch(url.toString(), { credentials: 'include' })
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

  const [showForm, setShowForm] = useState(false)

  if (loading) return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">Chargement…</div>

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-800 p-6 text-white shadow-xl">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">Administration • Services</p>
        <p className="text-sm text-indigo-100">Total des services : {totalServices} — dernier numéro : {lastServiceNumber}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un service..."
            className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900"
          />
          <button type="button" onClick={() => load(search)} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">Rechercher</button>
          <button type="button" onClick={() => { setSearch(''); load('') }} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">Effacer</button>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={() => setShowForm((prev) => !prev)} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">
          {showForm ? 'Masquer le formulaire' : 'Ajouter un service'}
        </button>
      </div>
      {showForm ? (
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
                <option value="">Auto</option>
                <option value="chauffage">Chauffage</option>
                <option value="plombier">Plombier</option>
                <option value="maintenance">Maintenance</option>
                <option value="travaux">Travaux</option>
              </select>
            </div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2 items-start">
            <div>
              <label className="mb-1 block text-sm font-medium text-indigo-100">Image (optionnelle)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-slate-900" />
              {form.image ? (
                <div className="mt-2">
                  <p className="text-xs text-indigo-200">Aperçu :</p>
                  <img src={form.image} alt="Aperçu" className="mt-1 max-h-40 rounded-lg border" />
                </div>
              ) : null}
            </div>
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium text-indigo-100">Description</label>
            <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[80px] w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900" />
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button onClick={create} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">Ajouter</button>
            <button onClick={() => setForm({ number: '', title: '', description: '', icon: '' })} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">Effacer</button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-3">
        {services.map((s) => (
          <div key={s.id} className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            {editingId === s.id ? (
              <div className="space-y-3">
                <input value={draft.number || ''} onChange={(e) => setDraft({ ...draft, number: e.target.value })} className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900" />
                <input value={draft.title || ''} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900" />
                <textarea value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="min-h-[80px] w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900" />
                <div>
                  <label className="mb-1 block text-sm font-medium text-indigo-100">Icône</label>
                  <select value={draft.icon || ''} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900">
                    <option value="">Auto</option>
                    <option value="chauffage">Chauffage</option>
                    <option value="plombier">Plombier</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="travaux">Travaux</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-indigo-100">Image (optionnelle)</label>
                  <input type="file" accept="image/*" onChange={(e) => handleEditFileChange(e, setDraft)} className="w-full text-sm text-slate-900" />
                  {draft.image ? (<img src={draft.image} alt="Aperçu" className="mt-2 max-h-36 rounded-lg border" />) : null}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => update({ ...(s as Service), number: draft.number || s.number, title: draft.title || s.title, description: draft.description || s.description, icon: draft.icon || s.icon, image: draft.image || s.image })} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">Enregistrer</button>
                  <button onClick={() => { setEditingId(null); setDraft({}) }} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">Annuler</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-2 text-sm text-indigo-100">#{s.number}</div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-indigo-100">{s.description}</p>
                  {s.image ? (<img src={s.image} alt={s.title} className="mt-2 max-h-28 rounded" />) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setEditingId(s.id ?? null); setDraft({ number: s.number, title: s.title, description: s.description, icon: s.icon, image: s.image }) }} className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white">Modifier</button>
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
