import { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Github, Linkedin, Twitter } from 'lucide-react'

interface SocialLinksProps {
  github: string
  linkedin: string
  twitter: string
}

export const SocialLinks: FC<SocialLinksProps> = ({
  github,
  linkedin,
  twitter,
}) => {
  return (
    <div className='flex gap-4 mt-4'>
      <Button variant='outline' asChild>
        <a href={github} target='_blank' rel='noopener noreferrer'>
          <Github className='mr-2 h-4 w-4' /> GitHub
        </a>
      </Button>
      <Button variant='outline' asChild>
        <a href={linkedin} target='_blank' rel='noopener noreferrer'>
          <Linkedin className='mr-2 h-4 w-4' /> LinkedIn
        </a>
      </Button>
      <Button variant='outline' asChild>
        <a href={twitter} target='_blank' rel='noopener noreferrer'>
          <Twitter className='mr-2 h-4 w-4' /> Twitter
        </a>
      </Button>
    </div>
  )
}
