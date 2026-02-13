'use client'

import { useState } from 'react'
import { useAuth } from './providers'
import { LoginButton } from '@/components/login-button'
import { AddBookmarkForm } from '@/components/add-bookmark-form'
import { BookmarksList } from '@/components/bookmarks-list'
import { UserMenu } from '@/components/user-menu'
import { Loader, Bookmark, Globe, Shield, Zap, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function Page() {
  const { user, loading } = useAuth()
  const [isAddingBookmark, setIsAddingBookmark] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  /**
   * HandleAddBookmark - sends POST request to save a new bookmark
   * and triggers a refresh of the list on success. Shows toast
   * notifications for both success and failure states.
   */
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

      /* Trigger a refresh of the bookmarks list */
      setRefreshTrigger((prev) => prev + 1)
      toast.success('Bookmark added successfully!', {
        description: `"${title}" has been saved to your collection.`,
      })
    } catch (error) {
      toast.error('Failed to add bookmark', {
        description: 'Something went wrong. Please try again.',
      })
      throw error
    } finally {
      setIsAddingBookmark(false)
    }
  }

  /* Show a full-screen loader while auth state is being resolved */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-purple-200 animate-ping opacity-20" />
          <Loader className="w-10 h-10 text-purple-600 animate-spin" />
        </div>
        <p className="mt-4 text-sm text-purple-600 font-medium">Loading your bookmarks...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* =================== HEADER =================== */}
      <header className="sticky top-0 z-50 glass shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Animated brand icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-200">
              <Bookmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">
                Smart Bookmarks
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Your personal link vault</p>
            </div>
          </div>
          {user && <UserMenu />}
        </div>
      </header>

      {/* =================== MAIN CONTENT =================== */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {!user ? (
          /* ---- LANDING / LOGIN SECTION ---- */
          <div className="flex flex-col items-center justify-center min-h-[75vh] gap-12">
            {/* Hero area with animated gradient text */}
            <div className="text-center animate-fade-in-up max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Save links in one click
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
                  Organize Your Web
                </span>
                <br />
                <span className="text-gray-900">Like Never Before</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                A beautiful, private bookmark manager. Save, organize, and access your favorite links from anywhere.
              </p>
            </div>

            {/* Sign-in card */}
            <div className="w-full max-w-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white rounded-2xl shadow-xl shadow-purple-100 border border-purple-100 p-8">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Get Started</h3>
                  <p className="text-sm text-gray-500 mt-1">Sign in to start saving bookmarks</p>
                </div>
                <LoginButton />
                <p className="text-xs text-gray-400 text-center mt-4">
                  Your bookmarks are private and encrypted
                </p>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <FeatureCard
                Icon={Globe}
                Title="Access Anywhere"
                Description="Your bookmarks sync across all your devices seamlessly."
              />
              <FeatureCard
                Icon={Shield}
                Title="Private & Secure"
                Description="Only you can see your bookmarks. Fully encrypted."
              />
              <FeatureCard
                Icon={Zap}
                Title="Lightning Fast"
                Description="Save and find your bookmarks in milliseconds."
              />
            </div>
          </div>
        ) : (
          /* ---- DASHBOARD SECTION (signed-in) ---- */
          <div className="space-y-8 animate-fade-in-up">
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium text-purple-100">Your Dashboard</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">
                Welcome back{user.email ? `, ${user.email.split('@')[0]}` : ''}!
              </h2>
              <p className="text-purple-100 mt-1 text-sm">
                Manage your bookmarks and discover your saved links.
              </p>
            </div>

            {/* Add bookmark form */}
            <AddBookmarkForm onAdd={handleAddBookmark} isLoading={isAddingBookmark} />

            {/* Bookmarks list */}
            <BookmarksList userId={user.id} refreshTrigger={refreshTrigger} />
          </div>
        )}
      </main>

      {/* =================== FOOTER =================== */}
      <footer className="border-t border-purple-100 mt-16 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bookmark className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
              Smart Bookmarks
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Save, organize, and access your bookmarks anywhere.
          </p>
        </div>
      </footer>
    </div>
  )
}

/**
 * FeatureCard - a small card used on the landing page to highlight
 * key features of the app (access anywhere, security, speed).
 */
function FeatureCard({
  Icon,
  Title,
  Description,
}: {
  Icon: React.ComponentType<{ className?: string }>
  Title: string
  Description: string
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-purple-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-purple-600" />
      </div>
      <h4 className="font-semibold text-gray-900 text-sm">{Title}</h4>
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{Description}</p>
    </div>
  )
}
