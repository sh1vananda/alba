// web/src/components/Footer.tsx

import Link from 'next/link';
import { client } from '@/lib/sanity.client';
import { groq } from 'next-sanity';
import Image from 'next/image';

interface Genre {
  title: string;
  slug: { current: string };
}

const genresQuery = groq`*[_type == "genre"] | order(title asc){ title, slug }`;

export default async function Footer() {
  const genres: Genre[] = await client.fetch(genresQuery);

  return (
    <footer className="border-t border-border mt-16 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-10">
          
          <div className="md:w-1/3 lg:w-1/4">
            <Link href="/" className="block mb-4">
              <Image
                src="/godrotted-logo.svg" 
                alt="Godrotted Logo"
                width={180} 
                height={48}  
                className="h-12 w-auto" 
              />
            </Link>
            <p className="text-sm text-secondary">
              In-depth reviews and analysis of horror films.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">Library</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/reviews" className="text-secondary hover:text-accent transition-colors text-sm">
                    All Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/index/a" className="text-secondary hover:text-accent transition-colors text-sm">
                    A-Z Index
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-foreground mb-4">Genres</h3>
              <ul className="space-y-3">
                {genres.slice(0, 5).map((genre) => (
                  <li key={genre.slug.current}>
                    <Link href={`/genres/${genre.slug.current}`} className="text-secondary hover:text-accent transition-colors text-sm">
                      {genre.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-4">More</h3>
              <ul className="space-y-3">
                <li>
                  <span className="text-secondary cursor-not-allowed text-sm">About</span>
                </li>
                <li>
                  <span className="text-secondary cursor-not-allowed text-sm">Contact</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-secondary">
          <p>© {new Date().getFullYear()} Godrotted. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}