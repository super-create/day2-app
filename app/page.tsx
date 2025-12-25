'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCount = async () => {
    setLoading(true)
    setError(null)

    const res = await fetch('/api/counter')

    if (!res.ok) {
      setError('Could not load counter')
      setLoading(false)
      return
    }

    const data = await res.json()
    setCount(data.value ?? 0)
    setLoading(false)
  }

  const increment = async () => {
    setLoading(true)
    setError(null)

    const res = await fetch('/api/counter/increment', { method: 'POST' })

    if (!res.ok) {
      setError('Could not update counter')
      setLoading(false)
      return
    }

    const data = await res.json()
    setCount(data.value ?? count)
    setLoading(false)
  }

  useEffect(() => {
    fetchCount()
  }, [])

  return (
    <div>
      <h1>Persistent Counter</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p>{loading ? 'Loading...' : `Count: ${count}`}</p>

      <button onClick={increment} disabled={loading}>
        Increase (and save)
      </button>

      <div style={{ marginTop: 16 }}>
        <Link href="/about">Go to About</Link>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={fetchCount} disabled={loading}>
          Refresh from DB
        </button>
      </div>
    </div>
  )
}
