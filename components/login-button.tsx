'use client'

import { useState } from 'react'
import { supabase, isDemoMode } from '@/lib/supabase'
import { demoAuth } from '@/lib/demo-auth'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/providers'
import { LogIn, Loader } from 'lucide-react'
import { toast } from 'sonner'

/**
 * LoginButton - handles Google OAuth sign-in or demo sign-in.
 * Shows a styled button with loading state and toast notifications
 * for success / error feedback.
 */
export function LoginButton() {
  const { isDemoMode: usingDemoMode } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)

      if (usingDemoMode) {
        /* Demo mode: sign in directly without OAuth */
        await demoAuth.signInWithGoogle()
        toast.success('Signed in successfully!', {
          description: 'Welcome to Smart Bookmarks (Demo Mode)',
        })
        /* Reload to trigger auth state update */
        window.location.reload()
      } else {
        /* Real Supabase OAuth: prompt=select_account forces Google to show
           the "Choose an account" screen every time instead of auto-sign-in */
        const { error } = await supabase!.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              prompt: 'select_account',
            },
          },
        })
        if (error) {
          toast.error('Sign-in failed', {
            description: error.message || 'Could not connect to Google. Please try again.',
          })
        }
      }
    } catch (error) {
      toast.error('Sign-in failed', {
        description: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 shadow-lg shadow-purple-200 transition-all duration-300 hover:shadow-xl hover:shadow-purple-300 hover:-translate-y-0.5"
    >
      {loading ? (
        <Loader className="w-5 h-5 mr-2 animate-spin" />
      ) : (
        <LogIn className="w-5 h-5 mr-2" />
      )}
      {loading ? 'Signing in...' : usingDemoMode ? 'Demo Sign In' : 'Sign in with Google'}
    </Button>
  )
}
