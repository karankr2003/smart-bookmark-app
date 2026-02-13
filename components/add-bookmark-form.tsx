'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Link, Type, Loader } from 'lucide-react'
import { toast } from 'sonner'

interface AddBookmarkFormProps {
  onAdd: (url: string, title: string) => Promise<void>
  isLoading?: boolean
}

/**
 * AddBookmarkForm - a styled form that lets users add a new bookmark
 * by providing a title and URL. Validates input and shows toast
 * notifications for validation errors.
 */
export function AddBookmarkForm({ onAdd, isLoading = false }: AddBookmarkFormProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    /* Validate that both fields are filled */
    if (!url.trim() || !title.trim()) {
      toast.warning('Missing fields', {
        description: 'Please fill in both the title and URL.',
      })
      return
    }

    /* Basic URL format validation */
    try {
      new URL(url)
    } catch {
      toast.warning('Invalid URL', {
        description: 'Please enter a valid URL starting with https://',
      })
      return
    }

    try {
      await onAdd(url, title)
      /* Clear the form on success */
      setUrl('')
      setTitle('')
    } catch {
      /* Error toast is handled in the parent handleAddBookmark */
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 hover:shadow-md transition-shadow duration-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <Plus className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Add Bookmark</h2>
        </div>

        {/* Title input */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
            <Type className="w-3.5 h-3.5 text-purple-500" />
            Title
          </label>
          <Input
            type="text"
            placeholder="e.g., My Favorite Blog"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="h-11 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-colors"
          />
        </div>

        {/* URL input */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
            <Link className="w-3.5 h-3.5 text-purple-500" />
            URL
          </label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            className="h-11 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-colors"
          />
        </div>

        {/* Submit button with gradient */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-xl text-base font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 shadow-md shadow-purple-100 hover:shadow-lg hover:shadow-purple-200 transition-all duration-300"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Adding...' : 'Add Bookmark'}
        </Button>
      </form>
    </div>
  )
}
