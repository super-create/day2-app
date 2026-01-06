'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type ErrorState = 'UNAUTH' | 'GENERIC' | null

export default function HomePage() {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<ErrorState>(null)

  // optional: show who is logged in
  const [meEmail, setMeEmail] = useState<string | null>(null)


  async function logout() {
    await fetch('/api/logout', { method: 'POST' })
    window.location.href = '/login'
  }


  async function loadMe() {
    try {
      const res = await fetch('/api/me', { cache: 'no-store' })
      if (!res.ok) {
        setMeEmail(null)
        return
      }
      const data = await res.json()
      setMeEmail(data?.user?.email ?? null)
    } catch {
      setMeEmail(null)
    }
  }

  async function loadCounter() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/counter', { cache: 'no-store' })

      if (res.status === 401) {
        setError('UNAUTH')
        setLoading(false)
        setCount(0)
        return
      }

      if (!res.ok) {
        setError('GENERIC')
        setLoading(false)
        return
      }

      const data = await res.json()
      setCount(typeof data.value === 'number' ? data.value : 0)
      setLoading(false)
    } catch {
      setError('GENERIC')
      setLoading(false)
    }
  }

  async function increment() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/counter/increment', {
        method: 'POST',
        cache: 'no-store',
      })

      if (res.status === 401) {
        setError('UNAUTH')
        setLoading(false)
        return
      }

      if (!res.ok) {
        setError('GENERIC')
        setLoading(false)
        return
      }

      const data = await res.json()
      setCount(typeof data.value === 'number' ? data.value : count)
      setLoading(false)
    } catch {
      setError('GENERIC')
      setLoading(false)
    }
  }

  useEffect(() => {
    // load identity first so UI shows logged-in state quickly
    loadMe()
    loadCounter()
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h1>Persistent Counter</h1>

      <div style={{ marginBottom: 12 }}>
        {meEmail ? (
          <p>Logged in as: <b>{meEmail}</b></p>
        ) : (
          <p>Not logged in</p>
        )}
        {meEmail && (
          <button onClick={logout} style={{ marginTop: 8 }}>
            Log out
          </button>
        )}

      </div>

      {error === 'UNAUTH' && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ color: 'orange' }}>
            You’re logged out. Please log in to use the counter.
          </p>
          <Link href="/login">Go to Login</Link>
        </div>
      )}

      {error === 'GENERIC' && (
        <p style={{ color: 'red' }}>
          Could not load counter
        </p>
      )}

      <p>Count: {count}</p>

      <button onClick={increment} disabled={loading || error === 'UNAUTH'}>
        Increase (and save)
      </button>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => { loadMe(); loadCounter() }} disabled={loading}>
          Refresh
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <Link href="/about">Go to About</Link>
      </div>
    </div>
  )
}
