// web/src/app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import Search from '@/components/Search'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Boovie | Horror Movie Reviews',
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
            <Link href="/" className="text-xl font-bold hover:text-secondary transition-colors">
              Boovie
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