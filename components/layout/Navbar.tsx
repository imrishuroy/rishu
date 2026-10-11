'use client'

import { useState } from 'react'
import Link from 'next/link'
import GitHubIcon from '@/components/ui/GitHubIcon'

const NAV_LINKS = [
  { label: 'Home',       href: '/#hero' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Skills',     href: '/#skills' },
  { label: 'Projects',   href: '/#projects' },
  { label: 'Blog',       href: '/blogs' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-surface/90 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/30">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-3 w-full">

        {/* Brand */}
        <Link
          href="/#hero"
          className="flex items-center gap-2.5 group active:scale-[0.98] transition-transform duration-100"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-md bg-primary-container text-on-primary-container font-mono text-xs font-bold cyan-glow shrink-0">
            RK
          </span>
          <span className="text-on-surface group-hover:text-primary transition-colors text-label-md font-semibold">
            Rishu Kumar
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-8 text-label-md">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-on-surface-variant hover:text-primary transition-colors duration-150 pb-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions cluster */}
        <div className="flex items-center space-x-4">
          {/* Social icons */}
          <div className="hidden sm:flex items-center space-x-3 text-on-surface-variant">
            <a
              href="https://github.com/imrishuroy"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="hover:text-primary hover:border-primary/50 transition-all duration-200 p-1.5 rounded-lg border border-outline-variant/30 flex items-center justify-center"
            >
              <GitHubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/imrishuroy/"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="hover:text-primary hover:border-primary/50 transition-all duration-200 p-1.5 rounded-lg border border-outline-variant/30 flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[1.125rem] h-[1.125rem]" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://leetcode.com/imrishuroy"
              target="_blank"
              rel="noopener noreferrer"
              title="LeetCode"
              className="hover:text-primary hover:border-primary/50 transition-all duration-200 p-1.5 rounded-lg border border-outline-variant/30 flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[1.125rem] h-[1.125rem]" aria-hidden="true">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
              </svg>
            </a>
            <a
              href="mailto:rishukumar.prince@gmail.com"
              title="Email"
              className="hover:text-primary hover:border-primary/50 transition-all duration-200 p-1.5 rounded-lg border border-outline-variant/30 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[1.125rem]">alternate_email</span>
            </a>
          </div>

          {/* Resume CTA */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-container text-on-primary-container hover:bg-primary-fixed-dim transition-all duration-200 px-4 py-2 rounded-lg text-label-md flex items-center gap-2 cyan-glow active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[1.125rem]">download</span>
            <span>Download Resume</span>
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer — always in DOM so aria-controls reference is valid */}
      <nav
        id="mobile-nav"
        className={`md:hidden border-t border-outline-variant/30 bg-surface px-6 py-4 flex flex-col gap-4 ${mobileOpen ? '' : 'hidden'}`}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-on-surface-variant hover:text-primary transition-colors text-label-md py-1"
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
