"use client"
import React, { useEffect, useState } from 'react'
import { showNotification } from '../../../components/AdminNotification'

type Project = { id?: number; title: string; description: string; image?: string; client?: string; category?: string }

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Project>>({ title: '', description: '', image: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Partial<Project>>({})
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [search, setSearch] = useState('')
  const totalProjects = projects.length

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

  async function load(query = '') {
    setLoading(true)
    const url = new URL('/api/admin/projects', window.location.origin)
    if (query) url.searchParams.set('q', query)
    const res = await fetch(url.toString(), { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) {
        setProjects(data)
      } else {
        setProjects([])
      }
    } else {
      setProjects([])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function create() {
    const payload = {
      title: form.title?.trim(),
      image: form.image?.trim(),
      description: form.description?.trim(),
    }
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      await load()
      setForm({ title: '', description: '', image: '' })
      showNotification('Réalisation ajoutée avec succès.', 'success')
    } else {
      showNotification('Échec de l\'ajout de la réalisation.', 'error')
    }
  }

  async function update(project: Project) {
    const payload = {
      image: draft.image?.trim() || project.image,
      description: draft.description?.trim() || project.description,
      title: project.title || project.description?.slice(0, 40) || 'Réalisation',
    }
    const res = await fetch(`/api/admin/projects/${project.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      await load()
      setEditingId(null)
      setDraft({})
      showNotification('Projet mis à jour avec succès.', 'success')
    } else {
      showNotification('Échec de la modification du projet.', 'error')
    }
  }

  async function remove(id?: number) {
    if (!id) return
    if (!confirm('Supprimer ce projet ?')) return
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) {
      await load()
      showNotification('Projet supprimé.', 'success')
    } else {
      showNotification('Échec de la suppression du projet.', 'error')
    }
  }

  const [showForm, setShowForm] = useState(false)

  if (loading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">Chargement…</div>
  }

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-800 p-6 text-white shadow-xl">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">Administration • Réalisations</p>
        <h2 className="text-2xl font-semibold">Gestion des réalisations</h2>
        <p className="text-sm text-indigo-100">Modifie les réalisations visibles sur la page publique.</p>
        <p className="text-sm text-indigo-100">Total des projets : {totalProjects}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une réalisation..."
            className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900"
          />
          <button type="button" onClick={() => load(search)} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">Rechercher</button>
          <button type="button" onClick={() => { setSearch(''); load('') }} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">Effacer</button>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" onClick={() => setShowForm((prev) => !prev)} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900">
          {showForm ? 'Masquer le formulaire' : 'Ajouter une réalisation'}
        </button>
      </div>
      {showForm ? (
        <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-indigo-100">Titre</label>
              <input
                type="text"
                value={form.title || ''}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300"
                placeholder="Titre du projet"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-indigo-100">Image</label>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) uploadFile(file, (url) => setForm({ ...form, image: url }))
                  }}
                  className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300"
                />
                {uploading ? <p className="text-sm text-indigo-100">Upload en cours...</p> : null}
                {uploadError ? <p className="text-sm text-rose-200">{uploadError}</p> : null}
                {form.image ? <img src={form.image} alt="Aperçu" className="h-40 w-full rounded-2xl object-cover" /> : null}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-indigo-100">Description</label>
              <textarea
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="min-h-[120px] w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300"
                placeholder="Description de la réalisation"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={create} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              Ajouter une réalisation
            </button>
            <button onClick={() => setForm({ title: '', description: '', image: '' })} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20">
              Effacer
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-3">
        {projects.length === 0 ? (
          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 text-sm text-indigo-100">Aucune réalisation trouvée dans la base de données.</div>
        ) : null}
        {projects.map((project) => (
          <div key={project.id || project.title} className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            {editingId === project.id ? (
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-indigo-100">Titre</label>
                    <input
                      type="text"
                      value={draft.title || project.title || ''}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300"
                      placeholder="Titre du projet"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) uploadFile(file, (url) => setDraft({ ...draft, image: url }))
                      }}
                      className="w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300"
                    />
                    {uploading ? <p className="text-sm text-indigo-100">Upload en cours...</p> : null}
                    {uploadError ? <p className="text-sm text-rose-200">{uploadError}</p> : null}
                    {(draft.image || project.image) ? (
                      <img src={draft.image || project.image} alt="Aperçu" className="h-40 w-full rounded-2xl object-cover" />
                    ) : null}
                  </div>
                </div>
                <textarea
                  value={draft.description || ''}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  className="min-h-[100px] w-full rounded-2xl border border-white/20 bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => update({ ...project, title: draft.title || project.title || 'Réalisation', description: draft.description || project.description, image: draft.image || project.image, client: project.client || '', category: project.category || '' })}
                    className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
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
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs uppercase tracking-[0.2em] text-indigo-100">{project.category || 'Service'}</span>
                    <span className="text-xs text-indigo-100">{project.client || 'Contenu public'}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="mt-1 text-sm text-indigo-100">{project.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setEditingId(project.id ?? null); setDraft({ image: project.image, description: project.description, title: project.title }) }} className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                    Modifier
                  </button>
                  <button onClick={() => remove(project.id)} className="rounded-2xl border border-rose-300/30 bg-rose-500/15 px-3 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/25">
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
