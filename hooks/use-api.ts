import { useState, useEffect, useCallback } from "react"

interface UseApiResult<T> {
  data: T
  loading: boolean
  error: string
  refresh: () => Promise<void>
}

export function useApi<T>(url: string, initial: T): UseApiResult<T> {
  const [data, setData] = useState<T>(initial)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(url)
      if (!res.ok) {
        const err = await res.json()
        setError(err.error || "Failed to fetch")
        return
      }
      const json = await res.json()
      setData(json)
    } catch {
      setError("Something went wrong")
    }
    setLoading(false)
  }, [url])

  useEffect(() => { fetchData() }, [fetchData])

  return { data, loading, error, refresh: fetchData }
}
