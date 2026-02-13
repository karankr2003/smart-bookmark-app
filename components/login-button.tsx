'use client'

import { useState } from 'react'
import { supabase, isDemoMode } from '@/lib/supabase'
import { demoAuth } from '@/lib/demo-auth'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/providers'

export function LoginButton() {
  const { isDemoMode: usingDemoMode } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)

      if (usingDemoMode) {
        // Demo mode: sign in directly without OAuth
        await demoAuth.signInWithGoogle()
        // Reload to trigger auth state update
        window.location.reload()
      } else {
        // Real Supabase OAuth
        const { error } = await supabase!.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) {
          console.error('Login error:', error)
        }
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleGoogleLogin} disabled={loading} className="w-full">
      {loading ? 'Signing in...' : usingDemoMode ? 'Demo Sign In' : 'Sign in with Google'}
    </Button>
  )
}
