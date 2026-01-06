'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function LoginPage() {
  // ✅ ROUTER GOES HERE
  const router = useRouter()

  const supabase = createSupabaseBrowserClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function signUp() {
    setLoading(true)
    setMsg(null)

    const { error } = await supabase.auth.signUp({ email, password })

    setLoading(false)
    setMsg(error ? error.message : 'Signed up. Now sign in.')
  }

  async function signIn() {
    setLoading(true)
    setMsg(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setMsg(error.message)
      return
    }

    // ✅ REDIRECT AFTER LOGIN
    router.push('/')
  }

  async function signOut() {
    setLoading(true)
    setMsg(null)

    const { error } = await supabase.auth.signOut()

    setLoading(false)
    setMsg(error ? error.message : 'Signed out.')
  }

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h1>Login</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: 8 }}
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: 12 }}
      />

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={signUp} disabled={loading}>
          Sign up
        </button>
        <button onClick={signIn} disabled={loading}>
          Sign in
        </button>
        <button onClick={signOut} disabled={loading}>
          Sign out
        </button>
      </div>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  )
}
