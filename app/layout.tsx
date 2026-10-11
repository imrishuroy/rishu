import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Rishu Kumar – Backend Software Engineer | Go & Distributed Systems',
  description:
    'Backend Software Engineer with 3+ years building cloud-based enterprise systems, distributed services, and observability tools with Go, AWS, Kafka, and Kubernetes.',
  authors: [{ name: 'Rishu Kumar' }],
  keywords: ['Go', 'Golang', 'Backend', 'Distributed Systems', 'Kafka', 'AWS', 'Kubernetes'],
  openGraph: {
    title: 'Rishu Kumar – Backend Software Engineer',
    description: 'Go • Distributed Systems • AWS • Kafka • Kubernetes',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
