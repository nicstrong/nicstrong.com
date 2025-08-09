import { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Github, Linkedin, X } from 'lucide-react'
import Link from 'next/link'

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/nicstrong',
    icon: Github,
  },
  {
    name: 'X',
    url: 'https://X.com/nicstrong',
    icon: X,
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/nicstrong',
    icon: Linkedin,
  },
]

export const SocialLinks: FC = () => {
  return (
    <div className='flex justify-center gap-4 mb-8'>
      {socialLinks.map((link) => {
        const Icon = link.icon
        return (
          <Button key={link.name} variant='outline' size='icon' asChild>
            <Link href={link.url} target='_blank' rel='noopener noreferrer'>
              <Icon className='h-4 w-4' />
              <span className='sr-only'>{link.name}</span>
            </Link>
          </Button>
        )
      })}
    </div>
  )
}
