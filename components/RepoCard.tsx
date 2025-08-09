import { FC } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { PinnedRepo } from '@/app/types'
import { ExternalLink, GitFork, Star } from 'lucide-react'
import Link from 'next/link'

interface RepoCardProps {
  project: PinnedRepo
}

export const RepoCard: FC<RepoCardProps> = ({ project }) => {
  return (
    <Card key={project.name} className='h-full'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div>
            <CardTitle className='text-lg'>
              <Link
                href={project.url}
                target='_blank'
                rel='noopener noreferrer'
                className='hover:underline flex items-center gap-2'
              >
                {project.name}
                <ExternalLink className='h-4 w-4' />
              </Link>
            </CardTitle>
            <CardDescription className='mt-2'>
              {project.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-4 text-sm text-muted-foreground mb-4'>
          <div className='flex items-center gap-1'>
            <Star className='h-4 w-4' />
            {project.stars.toLocaleString()}
          </div>
          <div className='flex items-center gap-1'>
            <GitFork className='h-4 w-4' />
            {project.forks}
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-3 h-3 rounded-full bg-blue-500'></div>
            {project.language}
          </div>
        </div>
        <div className='flex flex-wrap gap-2'>
          {project.topics.map((topic) => (
            <Badge key={topic} variant='secondary' className='text-xs'>
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
