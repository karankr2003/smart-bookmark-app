// In-memory storage for demo mode bookmarks
// This persists during the session but resets on server restart

interface DemoBookmark {
  id: string
  user_id: string
  url: string
  title: string
  created_at: string
  updated_at: string
}

// Global storage for demo bookmarks
const demoBookmarks: Map<string, DemoBookmark[]> = new Map()

export const demoStorage = {
  getBookmarks(userId: string): DemoBookmark[] {
    return (demoBookmarks.get(userId) || []).sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  },

  addBookmark(userId: string, bookmark: DemoBookmark): DemoBookmark {
    const userBookmarks = demoBookmarks.get(userId) || []
    userBookmarks.push(bookmark)
    demoBookmarks.set(userId, userBookmarks)
    return bookmark
  },

  deleteBookmark(userId: string, bookmarkId: string): boolean {
    const userBookmarks = demoBookmarks.get(userId) || []
    const index = userBookmarks.findIndex((b) => b.id === bookmarkId)

    if (index === -1) {
      return false
    }

    userBookmarks.splice(index, 1)
    demoBookmarks.set(userId, userBookmarks)
    return true
  },

  updateBookmark(userId: string, bookmarkId: string, updates: Partial<DemoBookmark>): DemoBookmark | null {
    const userBookmarks = demoBookmarks.get(userId) || []
    const bookmark = userBookmarks.find((b) => b.id === bookmarkId)

    if (!bookmark) {
      return null
    }

    const updated = { ...bookmark, ...updates, updated_at: new Date().toISOString() }
    const index = userBookmarks.findIndex((b) => b.id === bookmarkId)
    userBookmarks[index] = updated
    demoBookmarks.set(userId, userBookmarks)
    return updated
  },

  clear(): void {
    demoBookmarks.clear()
  },
}
