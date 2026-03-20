"use client"

import { useState } from "react"
import { MOCK_NOTIFICATIONS } from "@/components/notifications/mock-notifications"

export function useNotifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.leida).length

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    )
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })))
  }

  return { notifications, unreadCount, markAsRead, markAllAsRead }
}
