"use client"

import { useEffect, useState } from "react"
import { api, instance } from "@/api"
import { CalendarSubscription } from "@/types/CalendarSubscription"

interface UseCalendarSubscriptionReturn {
  subscription: CalendarSubscription | null
  isLoading: boolean
  error: string | null
  /** Rotate the token; the previously shared URL stops working. */
  regenerate: () => Promise<CalendarSubscription | null>
  isRegenerating: boolean
}

const setAuthHeaderFromStorage = () => {
  if (typeof window === "undefined") return
  const token = window.localStorage.getItem("token")
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`
  }
}

const useCalendarSubscription = (): UseCalendarSubscriptionReturn => {
  const [subscription, setSubscription] = useState<CalendarSubscription | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false)

  // POST is idempotent (get-or-create), so visiting the page lazily provisions
  // the token without creating a new one each time.
  const fetchSubscription = async () => {
    setIsLoading(true)
    setError(null)
    try {
      setAuthHeaderFromStorage()
      const response = await api.post("calendar/subscription")
      if (response?.status === 200) {
        setSubscription(response.data as CalendarSubscription)
      } else {
        setError("Failed to load calendar subscription")
      }
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Unexpected error loading calendar subscription"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscription()
  }, [])

  const regenerate = async (): Promise<CalendarSubscription | null> => {
    setIsRegenerating(true)
    setError(null)
    try {
      setAuthHeaderFromStorage()
      const response = await api.post("calendar/subscription/regenerate")
      if (response?.status === 200) {
        const updated = response.data as CalendarSubscription
        setSubscription(updated)
        return updated
      }
      setError("Failed to regenerate calendar link")
      return null
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Unexpected error regenerating calendar link"
      setError(message)
      return null
    } finally {
      setIsRegenerating(false)
    }
  }

  return { subscription, isLoading, error, regenerate, isRegenerating }
}

export default useCalendarSubscription
