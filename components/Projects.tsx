import { readCache } from '@/lib/cache'
import { PinnedRepo } from '@/lib/types'
import { ProjectsClient } from './ProjectsClient'
import { PINNED_REPOS_CACHE_KEY } from '@/lib/constants'

// Server-side function to get initial data
async function getInitialProjects(): Promise<PinnedRepo[]> {
  // Try to read from cache first for immediate response
  const cachedData = await readCache<PinnedRepo[]>(PINNED_REPOS_CACHE_KEY)
  if (cachedData) {
    return cachedData
  }

  try {
    // Use internal relative fetch; Next.js will handle the correct host during SSR.
    // Force dynamic fetch (no static rendering) so SSR gets fresh/cached server data.
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/github/pinned-repos`,
      {
        // Ensure we don't cache this at build time; rely on our own KV + rate limit.
        cache: 'no-store',
        // You could alternatively use next: { revalidate: 900 } if you want ISR.
      },
    )
    if (response.ok) {
      return response.json()
    }
  } catch (error) {
    console.error('Error fetching initial projects:', error)
  }

  return []
}

export async function Projects() {
  const initialProjects = await getInitialProjects()

  return <ProjectsClient initialProjects={initialProjects} />
}
