import Hero        from '@/components/sections/Hero'
import Experience  from '@/components/sections/Experience'
import Skills      from '@/components/sections/Skills'
import Projects    from '@/components/sections/Projects'
import BlogPreview from '@/components/sections/BlogPreview'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-14">
      <Hero />
      <Experience />
      <Skills />
      <Projects />
      <BlogPreview />
    </div>
  )
}
