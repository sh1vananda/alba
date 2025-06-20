// web/src/app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import Image from 'next/image'
import Search from '@/components/Search'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Anatomy of a Scream',
  description: 'Horror movie reviews, ratings, and recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <div className="container mx-auto flex justify-between items-center">
            
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.png" 
                alt="Anatomy of a Scream Logo"
                width={32} 
                height={32}
                className="transform transition-transform duration-300 group-hover:rotate-12"
              />
              
              <span className="text-xl font-bold group-hover:text-secondary transition-colors">
                Anatomy of a Scream
              </span>
            </Link>
            
            <Search />
          </div>
        </header>

        <div className="relative z-0">
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
