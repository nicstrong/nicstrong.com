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
          Software Developer & Lifelong Learner.
        </p>
        <SocialLinks />
      </section>

      <section className='mt-10 mx-auto'>
        <h2 className='text-2xl font-semibold'>About me</h2>
        <p className='text-muted-foreground mt-2'>
          I’m a software developer with over three decades of professional
          experience, building solutions since 1994. Over the years, I’ve worked
          extensively with C, C++, Java, C#, Kotlin, and TypeScript across
          diverse domains including telephony, finance, mobile, and unified
          communications. I love exploring open source projects and often use
          them as a way to explore new and exciting technologies. These days, my
          focus is on the rapidly evolving world of AI.
        </p>
      </section>

      <Projects />

      <section className='text-center text-muted-foreground'>
        <p>© 2025 Nic Strong.</p>
      </section>
    </main>
  )
}
