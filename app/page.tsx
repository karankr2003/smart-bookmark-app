'use client'

import { useState } from 'react'
import { useAuth } from './providers'
import { LoginButton } from '@/components/login-button'
import { AddBookmarkForm } from '@/components/add-bookmark-form'
import { BookmarksList } from '@/components/bookmarks-list'
import { UserMenu } from '@/components/user-menu'
import { Loader } from 'lucide-react'

export default function Page() {
  const { user, loading } = useAuth()
  const [isAddingBookmark, setIsAddingBookmark] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAddBookmark = async (url: string, title: string) => {
    try {
      setIsAddingBookmark(true)
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, title }),
      })

      if (!response.ok) {
        throw new Error('Failed to add bookmark')
      }

      // Trigger a refresh of the bookmarks list
      setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      throw error
    } finally {
      setIsAddingBookmark(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Smart Bookmarks</h1>
            <p className="text-sm text-gray-600">Save and organize your favorite links</p>
          </div>
          {user && <UserMenu />}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {!user ? (
          // Login Section
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Welcome</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Sign in with your Google account to start saving and organizing your bookmarks.
                Your bookmarks are private and only visible to you.
              </p>
            </div>
            <div className="w-full max-w-sm">
              <LoginButton />
            </div>
          </div>
        ) : (
          // Dashboard Section
          <div className="space-y-6">
            <AddBookmarkForm onAdd={handleAddBookmark} isLoading={isAddingBookmark} />
            <BookmarksList userId={user.id} refreshTrigger={refreshTrigger} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>Smart Bookmark App - Save, organize, and access your bookmarks anywhere</p>
        </div>
      </footer>
    </div>
  )
}
