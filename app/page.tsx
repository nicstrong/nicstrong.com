import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SocialLinks } from '@/components/SocialLinks'
import { RepoCard } from '@/components/RepoCard'
import { projects } from './constants'

export default function Home() {
  return (
    <main className='min-h-screen bg-background text-foreground p-8'>
      <section className='flex flex-col items-center text-center'>
        <Avatar className='w-24 h-24'>
          <AvatarImage src='/me.jpg' alt='Your Name' />
          <AvatarFallback>YN</AvatarFallback>
        </Avatar>
        <h1 className='text-4xl font-bold mt-4'>Your Name</h1>
        <p className='text-muted-foreground max-w-xl mt-2'>
          I’m a software developer passionate about building scalable web
          applications, open-source tools, and experimenting with new
          technologies.
        </p>
        <SocialLinks
          github='https://github.com/username'
          linkedin='https://linkedin.com/in/username'
          twitter='https://twitter.com/username'
        />
      </section>

      <section className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {projects.map((project) => (
          <RepoCard key={project.name} project={project} />
        ))}
      </section>
    </main>
  )
}
