import { useQuery } from '@tanstack/react-query'
import { Project } from '@/app/types'

async function fetchPinnedRepos(): Promise<Project[]> {
  const response = await fetch('/api/github/pinned-repos')
  if (!response.ok) {
    throw new Error('Failed to fetch pinned repositories')
  }
  return response.json()
}

export function usePinnedRepos(initialData?: Project[]) {
  return useQuery({
    queryKey: ['pinned-repos'],
    queryFn: fetchPinnedRepos,
    staleTime: 15 * 60 * 1000,
    initialData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  })
}
