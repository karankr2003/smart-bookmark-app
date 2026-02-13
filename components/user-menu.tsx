'use client'

import { useAuth } from '@/app/providers'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { toast } from 'sonner'

/**
 * UserMenu - displays the logged-in user's email with a styled
 * avatar badge and a logout button. Shows a toast on sign-out.
 */
export function UserMenu() {
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Signed out', {
        description: 'You have been signed out successfully.',
      })
    } catch {
      toast.error('Sign-out failed', {
        description: 'Could not sign out. Please try again.',
      })
    }
  }

  if (!user) return null

  /* Extract the first letter of the email for the avatar badge */
  const avatarLetter = user.email ? user.email[0].toUpperCase() : 'U'

  return (
    <div className="flex items-center gap-3">
      {/* Avatar badge with gradient background */}
      <div className="flex items-center gap-2.5 bg-purple-50 rounded-full pl-1 pr-3 py-1">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {avatarLetter}
        </div>
        <span className="hidden sm:inline text-sm font-medium text-gray-700 truncate max-w-[140px]">
          {user.email}
        </span>
      </div>

      {/* Logout button */}
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="gap-2 rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-300 transition-all duration-200"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  )
}
