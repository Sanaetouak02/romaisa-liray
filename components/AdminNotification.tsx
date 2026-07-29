"use client"
import React, { useEffect, useState } from 'react'

type Variant = 'success' | 'error' | 'info'

interface NotificationItem {
  id: number
  message: string
  variant: Variant
}

// Global notification state (singleton)
let notificationListeners: ((items: NotificationItem[]) => void)[] = []
let notificationIdCounter = 0
let currentNotifications: NotificationItem[] = []

function notifyAll() {
  notificationListeners.forEach((fn) => fn([...currentNotifications]))
}

export function showNotification(message: string, variant: Variant = 'info') {
  const id = ++notificationIdCounter
  currentNotifications = [...currentNotifications, { id, message, variant }]
  notifyAll()

  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    currentNotifications = currentNotifications.filter((n) => n.id !== id)
    notifyAll()
  }, 4000)
}

export function useNotifications() {
  const [items, setItems] = useState<NotificationItem[]>([])

  useEffect(() => {
    notificationListeners.push(setItems)
    // Sync with current state
    setItems([...currentNotifications])
    return () => {
      notificationListeners = notificationListeners.filter((fn) => fn !== setItems)
    }
  }, [])

  return items
}

export function dismissNotification(id: number) {
  currentNotifications = currentNotifications.filter((n) => n.id !== id)
  notifyAll()
}

const variantStyles: Record<Variant, { container: string; icon: React.ReactNode }> = {
  success: {
    container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  error: {
    container: 'bg-rose-50 border-rose-200 text-rose-800',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  info: {
    container: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
}

export default function AdminNotification() {
  const items = useNotifications()

  if (items.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {items.map((item) => {
        const { container, icon } = variantStyles[item.variant]
        return (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm font-medium shadow-lg animate-slide-in ${container}`}
          >
            {icon}
            <span className="flex-1">{item.message}</span>
            <button
              onClick={() => dismissNotification(item.id)}
              className="flex-shrink-0 ml-2 opacity-60 hover:opacity-100 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}
