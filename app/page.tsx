import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      <h1>Home page this is a test</h1>
      <Link href="/about">Go to About</Link>
    </div>
  )
}
'use client'

import { useState } from 'react'

export default function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Counter</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>
    </div>
  )
}
