import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createSupabaseServerClient()

  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr || !userData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = userData.user.id

  // fetch current
  const { data, error } = await supabase
    .from('counters')
    .select('value')
    .eq('user_id', userId)
    .single()

  let next = 1

  if (error && error.code === 'PGRST116') {
    // create first row at 1
    const { data: inserted, error: insErr } = await supabase
      .from('counters')
      .insert({ user_id: userId, value: 1 })
      .select('value')
      .single()

    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })
    return NextResponse.json({ value: inserted.value })
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  next = (data.value ?? 0) + 1

  const { data: updated, error: upErr } = await supabase
    .from('counters')
    .update({ value: next })
    .eq('user_id', userId)
    .select('value')
    .single()

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })
  return NextResponse.json({ value: updated.value })
}
