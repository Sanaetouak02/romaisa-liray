import React from 'react'

export const metadata = {
  title: 'Admin Panel',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e6eefc] via-[#f4f7fb] to-[#ffffff] p-6 lg:p-10">
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}