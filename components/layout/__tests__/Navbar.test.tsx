import { render, screen } from '@testing-library/react'
import Navbar from '../Navbar'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href as string} {...props}>{children}</a>
  ),
}))

test('resume CTA does not use dead font-label-md utility', () => {
  render(<Navbar />)
  const resumeLink = screen.getByRole('link', { name: /download resume/i })
  expect(resumeLink.className).not.toContain('font-label-md')
})
