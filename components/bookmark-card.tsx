'use client'

import { Button } from '@/components/ui/button'
import { Trash2, ExternalLink, Globe, Loader } from 'lucide-react'
import type { Bookmark } from '@/lib/supabase'
import { toast } from 'sonner'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => Promise<void>
  isDeleting?: boolean
}

/**
 * BookmarkCard - renders a single bookmark with its title, URL hostname,
 * creation date, and a delete button. Uses a confirmation toast before
 * deleting and shows success/error toasts for feedback.
 */
export function BookmarkCard({
  bookmark,
  onDelete,
  isDeleting = false,
}: BookmarkCardProps) {
  /**
   * HandleDelete - shows a confirmation dialog and calls the parent's
   * onDelete handler. The parent (BookmarksList) handles the actual
   * API call and its own toast notifications.
   */
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      await onDelete(bookmark.id)
    }
  }

  /* Safely parse the hostname from the bookmark URL */
  let hostname = bookmark.url
  try {
    hostname = new URL(bookmark.url).hostname
  } catch {
    hostname = bookmark.url
  }

  return (
    <div className="group bg-white rounded-xl border border-purple-100 p-4 hover:shadow-lg hover:shadow-purple-50 hover:border-purple-200 hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Favicon / globe icon */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-fuchsia-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Globe className="w-5 h-5 text-purple-500" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Bookmark title */}
            <h3 className="font-semibold text-gray-900 truncate text-base">{bookmark.title}</h3>

            {/* Clickable URL hostname */}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 text-sm truncate flex items-center gap-1 mt-1 group/link"
            >
              <span className="truncate">{hostname}</span>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </a>

            {/* Creation date */}
            <p className="text-xs text-gray-400 mt-1.5">
              {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Delete button - appears on hover */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0"
        >
          {isDeleting ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
