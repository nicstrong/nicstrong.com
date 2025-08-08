'use client'

import { RepoCard } from '@/components/RepoCard'
import { usePinnedRepos } from '@/hooks/usePinnedRepos'

export function Projects() {
  const { data: projects, isLoading, error } = usePinnedRepos()

  return (
    <section className='mt-12 mb-12'>
      <h2 className='text-2xl font-semibold mb-4'>My Github Projects</h2>
      {isLoading && (
        <div className='text-center text-muted-foreground'>
          Loading projects...
        </div>
      )}
      {error && (
        <div className='text-center text-red-500'>
          Failed to load projects. Please try again later.
        </div>
      )}
      {projects && projects.length > 0 && (
        <div className='grid gap-6 md:grid-cols-2'>
          {projects.map((project) => (
            <RepoCard key={project.name} project={project} />
          ))}
        </div>
      )}
      {projects && projects.length === 0 && (
        <div className='text-center text-muted-foreground'>
          No pinned projects found.
        </div>
      )}
    </section>
  )
}
