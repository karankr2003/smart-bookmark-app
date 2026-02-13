'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isDemoMode } from '@/lib/supabase'
import { demoAuth, type DemoUser } from '@/lib/demo-auth'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: (User | DemoUser) | null
  loading: boolean
  signOut: () => Promise<void>
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(User | DemoUser) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isDemoMode) {
          // Demo mode: use localStorage-based auth
          const demoUser = demoAuth.getCurrentUser()
          setUser(demoUser ?? null)
        } else {
          // Real Supabase mode
          const {
            data: { session },
          } = await supabase!.auth.getSession()
          setUser(session?.user ?? null)

          // Listen for auth changes
          const {
            data: { subscription },
          } = supabase!.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
          })

          return () => subscription?.unsubscribe()
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const signOut = async () => {
    if (isDemoMode) {
      await demoAuth.signOut()
    } else {
      await supabase!.auth.signOut()
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
