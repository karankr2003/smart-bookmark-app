'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, ExternalLink } from 'lucide-react'
import type { Bookmark } from '@/lib/supabase'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => Promise<void>
  isDeleting?: boolean
}

export function BookmarkCard({
  bookmark,
  onDelete,
  isDeleting = false,
}: BookmarkCardProps) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      await onDelete(bookmark.id)
    }
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{bookmark.title}</h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm truncate flex items-center gap-1 mt-2"
          >
            {new URL(bookmark.url).hostname}
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
          </a>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(bookmark.created_at).toLocaleDateString()}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800 hover:bg-red-50 flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
