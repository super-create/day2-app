import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()

  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr || !userData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = userData.user.id

  const { data, error } = await supabase
    .from('counters')
    .select('value')
    .eq('user_id', userId)
    .single()

  // no row yet -> create it
  if (error && error.code === 'PGRST116') {
    const { data: inserted, error: insErr } = await supabase
      .from('counters')
      .insert({ user_id: userId, value: 0 })
      .select('value')
      .single()

    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })
    return NextResponse.json({ value: inserted.value })
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ value: data.value })
}
