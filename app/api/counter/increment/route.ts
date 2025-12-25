import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  // Read current value
  const { data, error } = await supabase
    .from('counter')
    .select('value')
    .eq('id', 1)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Counter not found' },
      { status: 404 }
    )
  }

  const current = data.value

  if (typeof current !== 'number') {
    return NextResponse.json(
      { error: 'Invalid counter value' },
      { status: 400 }
    )
  }

  const next = current + 1

  const { error: updateError } = await supabase
    .from('counter')
    .update({ value: next })
    .eq('id', 1)

  if (updateError) {
    return NextResponse.json(
      { error: 'Failed to update counter' },
      { status: 500 }
    )
  }

  return NextResponse.json({ value: next })
}
