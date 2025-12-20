import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      <h1>Home page this is a test</h1>
      <Link href="/about">Go to About</Link>
    </div>
  )
}
