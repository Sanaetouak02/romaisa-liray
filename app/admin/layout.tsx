import React from 'react'
import AdminNav from '../../components/AdminNav'

export const metadata = {
  title: 'Admin',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AdminNav />
        <main className="bg-white shadow rounded-lg p-6">{children}</main>
      </div>
    </div>
  )
}
