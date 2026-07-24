"use client"
import React, { useEffect, useState } from 'react'

type Client = { id?: number; name: string; logo: string }

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Client>>({ name: '', logo: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Partial<Client>>({})
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function uploadFile(file: File, setField: (url: string) => void) {
    setUploadError('')
    setUploading(true)
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result
          if (typeof result === 'string') resolve(result)
          else reject(new Error('Invalid file data'))
        }
        reader.onerror = () => reject(new Error('Upload failed'))
        reader.readAsDataURL(file)
      })
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, data: dataUrl }),
      })
      if (!res.ok) throw new Error('Upload échoué')
      const data = await res.json()
      setField(data.url)
    } catch (error) {
      setUploadError('Échec de l’upload de l’image.')
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/clients', { credentials: 'include' })
    if (res.ok) setClients(await res.json())
    setLoading(false)
  }

  async function create() {
    setMessage('')
    const res = await fetch('/api/admin/clients', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) {
      const added = await res.json()
      setClients([added, ...clients])
      setForm({ name: '', logo: '' })
      setMessage('Client ajouté.')
    } else setMessage('Erreur lors de l\'ajout.')
  }

  async function update(item: Client) {
    setMessage('')
    const res = await fetch(`/api/admin/clients/${item.id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
    if (res.ok) {
      const updated = await res.json()
      setClients(clients.map((c) => (c.id === updated.id ? updated : c)))
      setEditingId(null)
      setDraft({})
      setMessage('Modifié.')
    } else setMessage('Erreur lors de la modification.')
  }

  async function remove(id?: number) {
    if (!id) return
    if (!confirm('Supprimer ce client ?')) return
    const res = await fetch(`/api/admin/clients/${id}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) {
      setClients(clients.filter((c) => c.id !== id))
      setMessage('Supprimé.')
    }
  }

  if (loading) return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">Chargement…</div>

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-800 p-6 text-white shadow-xl">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">Administration • Clients</p>
        <h2 className="text-2xl font-semibold">Gestion des clients</h2>
      </div>

      <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-indigo-100">Nom</label>
            <input
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900"
              placeholder="Nom du client"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-indigo-100">Logo</label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadFile(file, (url) => setForm({ ...form, logo: url }))
                }}
                className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900"
              />
              {uploading ? <p className="text-sm text-indigo-100">Upload en cours...</p> : null}
              {uploadError ? <p className="text-sm text-rose-200">{uploadError}</p> : null}
              {form.logo ? <img src={form.logo} alt="Aperçu client" className="h-24 w-full rounded-2xl object-cover" /> : null}
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={create} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">Ajouter</button>
          <button onClick={() => setForm({ name: '', logo: '' })} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">Effacer</button>
        </div>
      </div>

      <div className="grid gap-3">
        {clients.map((c) => (
          <div key={c.id} className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            {editingId === c.id ? (
              <div className="space-y-3">
                <input
                  value={draft.name || ''}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900"
                />
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) uploadFile(file, (url) => setDraft({ ...draft, logo: url }))
                    }}
                    className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900"
                  />
                  {uploading ? <p className="text-sm text-indigo-100">Upload en cours...</p> : null}
                  {uploadError ? <p className="text-sm text-rose-200">{uploadError}</p> : null}
                  {draft.logo ? <img src={draft.logo} alt="Aperçu client" className="h-24 w-full rounded-2xl object-cover" /> : null}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => update({ ...(c as Client), name: draft.name || c.name, logo: draft.logo || c.logo })}
                    className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
                  >
                    Enregistrer
                  </button>
                  <button onClick={() => { setEditingId(null); setDraft({}) }} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">Annuler</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {c.logo ? (
                    <img src={c.logo} alt={c.name} className="h-16 w-16 rounded-2xl border border-white/20 object-cover" />
                  ) : null}
                  <div>
                    <h3 className="text-lg font-semibold">{c.name}</h3>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(c.id ?? null); setDraft({ name: c.name, logo: c.logo }) }} className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white">Modifier</button>
                  <button onClick={() => remove(c.id)} className="rounded-2xl border border-rose-300/30 bg-rose-500/15 px-3 py-2 text-sm font-semibold text-rose-100">Supprimer</button>
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
