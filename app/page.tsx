'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function HomePage() {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchCount = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('counter')
      .select('value')
      .eq('id', 1)
      .single()

    if (error) {
      console.log('fetch error:', error)
      setLoading(false)
      return
    }

    setCount(data?.value ?? 0)
    setLoading(false)
  }

  const increment = async () => {
    const next = count + 1
    setCount(next) // optimistic UI

    const { error } = await supabase
      .from('counter')
      .update({ value: next })
      .eq('id', 1)

    if (error) {
      console.log('update error:', error)
      // revert if update fails
      setCount(count)
      return
    }
  }

  useEffect(() => {
    fetchCount()
  }, [])

  return (
    <div>
      <h1>Persistent Counter</h1>

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
