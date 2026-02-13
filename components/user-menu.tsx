'use client'

import { useAuth } from '@/app/providers'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export function UserMenu() {
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">{user.email}</span>
      </div>
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  )
}
