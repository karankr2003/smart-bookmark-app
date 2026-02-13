'use client'

import { useEffect, useState } from 'react'
import { supabase, isDemoMode } from '@/lib/supabase'
import { BookmarkCard } from './bookmark-card'
import { useAuth } from '@/app/providers'
import type { Bookmark } from '@/lib/supabase'
import { Loader, BookmarkX, Bookmark as BookmarkIcon } from 'lucide-react'
import { toast } from 'sonner'

interface BookmarksListProps {
  userId: string
  refreshTrigger?: number
}

/**
 * Payload from Supabase Realtime postgres_changes subscription.
 * eventType is the change kind; new/old hold the row data for INSERT/UPDATE/DELETE.
 */
interface PostgresChangePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Record<string, unknown> | null
  old: Record<string, unknown> | null
}

/**
 * BookmarksList - fetches and displays all bookmarks for the logged-in
 * user. Subscribes to real-time changes in Supabase mode. Shows toast
 * notifications for fetch errors, delete success, and delete errors.
 */
export function BookmarksList({ userId, refreshTrigger = 0 }: BookmarksListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { isDemoMode: usingDemoMode } = useAuth()

  /* Fetch all bookmarks from the API */
  const fetchBookmarks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bookmarks', { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch bookmarks')
      const data = await response.json()
      setBookmarks(data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      toast.error('Failed to load bookmarks', {
        description: 'Could not fetch your bookmarks. Please refresh the page.',
      })
      setBookmarks([])
    } finally {
      setLoading(false)
    }
  }

  /* Initial fetch and re-fetch when refreshTrigger changes */
  useEffect(() => {
    fetchBookmarks()
  }, [userId, refreshTrigger])

  /* Subscribe to real-time changes (only in real Supabase mode) */
  useEffect(() => {
    if (usingDemoMode || !supabase) {
      return
    }

    const subscription = supabase
      .channel(`bookmarks:user_id=eq.${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload: PostgresChangePayload) => {
          if (payload.eventType === 'INSERT') {
            const newBookmark = payload.new as Bookmark
            setBookmarks((prev) => [newBookmark, ...prev])
          } else if (payload.eventType === 'DELETE') {
            const deletedBookmark = payload.old as Bookmark
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== deletedBookmark.id)
            )
          } else if (payload.eventType === 'UPDATE') {
            const updatedBookmark = payload.new as Bookmark
            setBookmarks((prev) =>
              prev.map((b) => (b.id === updatedBookmark.id ? updatedBookmark : b))
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, usingDemoMode])

  /**
   * HandleDelete - calls the DELETE API endpoint and shows a success
   * or error toast based on the result.
   */
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)

      /* Find the bookmark title before deleting for the toast message */
      const deletedBookmark = bookmarks.find((b) => b.id === id)

      const response = await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete bookmark')
      }

      setBookmarks((prev) => prev.filter((b) => b.id !== id))
      toast.success('Bookmark deleted', {
        description: deletedBookmark
          ? `"${deletedBookmark.title}" has been removed.`
          : 'Bookmark has been removed.',
      })
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      toast.error('Delete failed', {
        description: 'Could not delete the bookmark. Please try again.',
      })
    } finally {
      setDeletingId(null)
    }
  }

  /* Loading skeleton state */
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <BookmarkIcon className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-gray-900">Your Bookmarks</h2>
        </div>
        {/* Skeleton loading cards */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-purple-100 p-4 animate-pulse"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-purple-100 rounded w-3/4" />
                <div className="h-3 bg-purple-50 rounded w-1/2" />
                <div className="h-3 bg-purple-50 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  /* Empty state when user has no bookmarks */
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
          <BookmarkX className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No bookmarks yet</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Start adding your favorite links using the form above. They will appear here!
        </p>
      </div>
    )
  }

  /* Render the list of bookmark cards */
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookmarkIcon className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-gray-900">Your Bookmarks</h2>
        </div>
        <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          {bookmarks.length} {bookmarks.length === 1 ? 'link' : 'links'}
        </span>
      </div>
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={handleDelete}
          isDeleting={deletingId === bookmark.id}
        />
      ))}
    </div>
  )
}
