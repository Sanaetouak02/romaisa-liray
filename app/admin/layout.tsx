import React from 'react'
import AdminNav from '../../components/AdminNav'
import AdminNotification from '../../components/AdminNotification'

export const metadata = {
  title: 'Admin',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminNotification />
      <AdminNav />
      <main className="pt-24 md:pt-6 md:ml-72 xl:ml-80 min-h-screen w-full md:w-[calc(100%-18rem)] xl:w-[calc(100%-20rem)] px-6 py-6">
        {children}
      </main>
    </div>
  )
}
