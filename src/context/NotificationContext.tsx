import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { notifications as initialSeedNotifications, type Notification } from '@/lib/data'
import { useToast } from '@/components/ui/Toast'

export interface ExtendedNotification extends Notification {
  url?: string
}

const STORAGE_KEY = 'resolution_notifications_v1'

interface NotificationContextType {
  notifications: ExtendedNotification[]
  unreadCount: number
  filter: 'all' | 'unread'
  setFilter: (filter: 'all' | 'unread') => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
  addNotification: (notification: Omit<ExtendedNotification, 'id' | 'time' | 'read'>) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const DEFAULT_NOTIFICATIONS: ExtendedNotification[] = initialSeedNotifications.map((n) => {
  let url = '/tickets'
  if (n.type === 'ai') url = '/ai'
  else if (n.type === 'billing') url = '/settings'
  else if (n.type === 'system') url = '/automations'
  return { ...n, url }
})

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const [notifications, setNotifications] = useState<ExtendedNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Failed to parse notifications from localStorage:', e)
    }
    return DEFAULT_NOTIFICATIONS
  })

  // Synchronize changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
    } catch (e) {
      console.warn('Failed to save notifications to localStorage:', e)
    }
  }, [notifications])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
    toast({
      type: 'success',
      title: 'Notifications Updated',
      description: 'All notifications marked as read.',
    })
  }, [toast])

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
    toast({
      type: 'info',
      title: 'Notification Dismissed',
      description: 'Notification has been removed.',
    })
  }, [toast])

  const clearAll = useCallback(() => {
    setNotifications([])
    toast({
      type: 'info',
      title: 'Notifications Cleared',
      description: 'All notification history cleared.',
    })
  }, [toast])

  const addNotification = useCallback((notification: Omit<ExtendedNotification, 'id' | 'time' | 'read'>) => {
    const newItem: ExtendedNotification = {
      ...notification,
      id: `N-${Date.now()}`,
      time: new Date().toISOString(),
      read: false,
    }
    setNotifications((prev) => [newItem, ...prev])
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        filter,
        setFilter,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
