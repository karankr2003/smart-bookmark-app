'use client'

import { useEffect, useState } from 'react'
import { supabase, isDemoMode } from '@/lib/supabase'
import { BookmarkCard } from './bookmark-card'
import { useAuth } from '@/app/providers'
import type { Bookmark } from '@/lib/supabase'

interface BookmarksListProps {
  userId: string
  refreshTrigger?: number
}

export function BookmarksList({ userId, refreshTrigger = 0 }: BookmarksListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { isDemoMode: usingDemoMode } = useAuth()

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bookmarks', { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch bookmarks')
      const data = await response.json()
      setBookmarks(data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      setBookmarks([])
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchBookmarks()
  }, [userId, refreshTrigger])

  // Subscribe to real-time changes (only in real Supabase mode)
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
        (payload) => {
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

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete bookmark')
      }

      setBookmarks((prev) => prev.filter((b) => b.id !== id))
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      alert('Failed to delete bookmark')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading bookmarks...</div>
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No bookmarks yet. Add one to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Your Bookmarks ({bookmarks.length})</h2>
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
