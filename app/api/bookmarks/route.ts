import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/supabase'
import { demoAuth } from '@/lib/demo-auth'
import { demoStorage } from '@/lib/demo-storage'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    if (isDemoMode) {
      // Demo mode: use in-memory storage
      const user = demoAuth.getCurrentUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const bookmarks = demoStorage.getBookmarks(user.id)
      return NextResponse.json(bookmarks)
    }

    // Real Supabase mode - uses cookie-based session
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, title } = await request.json()

    if (!url || !title) {
      return NextResponse.json(
        { error: 'URL and title are required' },
        { status: 400 }
      )
    }

    if (isDemoMode) {
      // Demo mode: store in memory using persistent storage
      const user = demoAuth.getCurrentUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const newBookmark = {
        id: 'bookmark_' + Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        url,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const saved = demoStorage.addBookmark(user.id, newBookmark)
      return NextResponse.json(saved, { status: 201 })
    }

    // Real Supabase mode - uses cookie-based session
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([
        {
          user_id: session.user.id,
          url,
          title,
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
