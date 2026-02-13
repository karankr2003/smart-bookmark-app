// Demo authentication service - works without Supabase
// For production, replace this with real Supabase authentication

export interface DemoUser {
  id: string
  email: string
  user_metadata?: {
    name?: string
    picture?: string
  }
}

// Store demo session in localStorage
const DEMO_USER_KEY = 'demo_bookmark_user'
const DEMO_BOOKMARKS_KEY = 'demo_bookmarks'

class DemoAuthService {
  private currentUser: DemoUser | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_USER_KEY)
      if (stored) {
        this.currentUser = JSON.parse(stored)
      }
    }
  }

  getCurrentUser(): DemoUser | null {
    return this.currentUser
  }

  async signInWithGoogle(): Promise<DemoUser> {
    // In a real app, this would redirect to Google OAuth
    // For demo, create a mock user
    const user: DemoUser = {
      id: 'demo_user_' + Math.random().toString(36).substr(2, 9),
      email: 'demo@example.com',
      user_metadata: {
        name: 'Demo User',
        picture: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
      },
    }

    this.currentUser = user

    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user))
    }

    return user
  }

  async signOut(): Promise<void> {
    this.currentUser = null

    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_USER_KEY)
    }
  }

  async getSession(): Promise<{ user: DemoUser | null }> {
    return { user: this.currentUser }
  }
}

export const demoAuth = new DemoAuthService()
