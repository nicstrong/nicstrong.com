import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SocialLinks } from '@/components/SocialLinks'
import { Projects } from '@/components/Projects'

export default function Home() {
  return (
    <main className='min-h-screen bg-background text-foreground p-8 mx-auto max-w-4xl'>
      <section className='flex flex-col items-center text-center'>
        <Avatar className='w-24 h-24'>
          <AvatarImage src='/me.jpg' alt='Nic Strong' />
          <AvatarFallback>NS</AvatarFallback>
        </Avatar>
        <h1 className='text-4xl font-bold mt-4'>Nic Strong</h1>
        <p className='text-muted-foreground max-w-xl mt-2 mb-4'>
          Full Stack Developer & Open Source Enthusiast.
        </p>
        <SocialLinks />
      </section>

      <section className='mt-10 mx-auto'>
        <h2 className='text-2xl font-semibold'>About me</h2>
        <p className='text-muted-foreground mt-2'>
          I&aposm a full‑stack engineer who loves turning ideas into polished,
          user‑friendly products. I enjoy working across the stack—from crafting
          accessible UIs to designing robust APIs—and I&aposm always exploring
          new tools, patterns, and ways to ship high‑quality software.
        </p>
      </section>

      <Projects />

      <section className='text-center text-muted-foreground'>
        <p>© 2025 Nic Strong.</p>
      </section>
    </main>
  )
}
