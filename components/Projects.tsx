import { readCache } from '@/lib/cache'
import { PinnedRepo } from '@/app/types'
import { ProjectsClient } from './ProjectsClient'

// Server-side function to get initial data
async function getInitialProjects(): Promise<PinnedRepo[]> {
  // Try to read from cache first for immediate response
  const cachedData = await readCache<PinnedRepo[]>('pinned-repos')
  if (cachedData) {
    return cachedData
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/github/pinned-repos`)
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
