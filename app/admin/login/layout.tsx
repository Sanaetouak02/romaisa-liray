import React from 'react'

export const metadata = {
  title: 'Admin Login',
}

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6eefc] via-[#f4f7fb] to-[#ffffff] flex items-center justify-center p-4">
      {children}
    </div>
  )
}
