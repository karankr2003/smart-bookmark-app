'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'

interface AddBookmarkFormProps {
  onAdd: (url: string, title: string) => Promise<void>
  isLoading?: boolean
}

export function AddBookmarkForm({ onAdd, isLoading = false }: AddBookmarkFormProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!url.trim() || !title.trim()) {
      setError('Please fill in all fields')
      return
    }

    try {
      // Basic URL validation
      new URL(url)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    try {
      await onAdd(url, title)
      setUrl('')
      setTitle('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add bookmark')
    }
  }

  return (
    <Card className="p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Add Bookmark</h2>
        
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            type="text"
            placeholder="e.g., My Favorite Blog"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URL</label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          {isLoading ? 'Adding...' : 'Add Bookmark'}
        </Button>
      </form>
    </Card>
  )
}
