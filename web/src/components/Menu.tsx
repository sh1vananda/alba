// web/src/components/Menu.tsx

"use client";

import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Menu as MenuIcon, X } from 'lucide-react';
import Link from 'next/link';
import { client } from '@/lib/sanity.client';
import { groq } from 'next-sanity';

interface Genre {
  title: string;
  slug: { current: string };
}

const genresQuery = groq`*[_type == "genre"] | order(title asc){ title, slug }`;

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    client.fetch(genresQuery).then(setGenres);
  }, []);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 rounded-md hover:bg-white/10 transition-colors">
        <MenuIcon className="h-6 w-6" />
        <span className="sr-only">Open Menu</span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeMenu}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full justify-end">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full" 
                enterTo="translate-x-0"  
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0" 
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden bg-background p-6 text-left align-middle shadow-xl transition-all border-l border-border">
                  <div className="flex justify-between items-center mb-8">
                    <Dialog.Title as="h3" className="text-2xl font-bold text-accent">
                      Explore
                    </Dialog.Title>
                    <button onClick={closeMenu} className="p-2 rounded-md hover:bg-white/10 transition-colors">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close Menu</span>
                    </button>
                  </div>

                  {/* --- MENU SECTIONS --- */}
                  <div className="space-y-8">

                    {/* Section 1: Discovery Tools (NEW) */}
                    <div>
                      <h4 className="font-semibold text-secondary mb-3">Discovery Tools</h4>
                      <Link href="/explore/scare-o-meter" onClick={closeMenu}
                        className="block rounded-md p-2 hover:bg-white/10 transition-colors"
                      >
                        Scare-O-Meter
                      </Link>
                    </div>

                    {/* Section 2: Library */}
                    <div>
                      <h4 className="font-semibold text-secondary mb-3">Library</h4>
                      <Link href="/reviews" onClick={closeMenu}
                        className="block rounded-md p-2 hover:bg-white/10 transition-colors"
                      >
                        View All Reviews
                      </Link>
                    </div>
                    
                    {/* Section 3: By Genre */}
                    <div>
                      <h4 className="font-semibold text-secondary mb-3">By Genre</h4>
                      <div className="flex flex-wrap gap-2">
                        {genres.map(genre => (
                          <Link key={genre.slug.current} href={`/genres/${genre.slug.current}`} onClick={closeMenu}
                            className="bg-white/5 text-foreground px-3 py-1 rounded-full text-sm hover:bg-white/20 transition-colors"
                          >
                            {genre.title}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Section 4: By Title (A-Z) */}
                    <div>
                      <h4 className="font-semibold text-secondary mb-3">By Title (A-Z)</h4>
                      <div className="flex flex-wrap gap-2">
                        {alphabet.map(letter => (
                          <Link key={letter} href={`/index/${letter.toLowerCase()}`} onClick={closeMenu}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-foreground hover:bg-white/20 transition-colors"
                          >
                            {letter}
                          </Link>
                        ))}
                      </div>
                    </div>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}