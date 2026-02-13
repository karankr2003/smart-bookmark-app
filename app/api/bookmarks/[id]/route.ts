import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/supabase'
import { demoAuth } from '@/lib/demo-auth'
import { demoStorage } from '@/lib/demo-storage'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (isDemoMode) {
      const user = demoAuth.getCurrentUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const deleted = demoStorage.deleteBookmark(user.id, id)

      if (!deleted) {
        return NextResponse.json(
          { error: 'Bookmark not found or unauthorized' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true })
    }

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

    // Verify ownership
    const { data: bookmark, error: fetchError } = await supabase
      .from('bookmarks')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !bookmark || bookmark.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Bookmark not found or unauthorized' },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
