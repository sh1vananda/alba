// web/src/app/layout.tsx

import type { Metadata } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google' 
import './globals.css'
import Link from 'next/link'
import Image from 'next/image'
import Search from '@/components/Search'
import Menu from '@/components/Menu'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', 
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'], 
  display: 'swap',
  variable: '--font-bebas-neue',
})

export const metadata: Metadata = {
  title: 'Anatomy of a Scream',
  description: 'Horror movie reviews',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bebasNeue.variable} bg-background text-foreground font-sans`}>
        <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <div className="container mx-auto flex justify-between items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <Image 
                src="/logo.png" 
                alt="Anatomy of a Scream Logo" 
                width={32} 
                height={32}
                className="transform transition-transform duration-300 group-hover:rotate-12" 
              />
              <span className="text-2xl font-heading tracking-wider group-hover:text-secondary transition-colors hidden sm:inline">
                Anatomy of a Scream
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Search />
              <Menu />
            </div>
          </div>
        </header>

        <div className="relative z-0">
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}