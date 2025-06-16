// web/src/components/Search.tsx

"use client";

import { useState, useEffect, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { client } from '@/lib/sanity.client';
import { groq } from 'next-sanity';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';

interface SearchableReview {
  title: string;
  slug: { current: string };
}

const searchQuery = groq`*[_type == "review"]{ title, slug }`;

const fuseOptions = {
  keys: ['title'],
  includeScore: true,
  threshold: 0.4,
};

export default function Search() {
  const [query, setQuery] = useState('');
  const [fuse, setFuse] = useState<Fuse<SearchableReview> | null>(null);
  const router = useRouter();

  useEffect(() => {
    client.fetch(searchQuery).then((data: SearchableReview[]) => {
      setFuse(new Fuse(data, fuseOptions));
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = query && fuse ? fuse.search(query).map(result => result.item) : [];
  const showResults = query.length > 0;

  const handleSelection = (review: SearchableReview) => {
    if (review?.slug?.current) {
      router.push(`/reviews/${review.slug.current}`);
      setQuery(''); // Clear input after navigation
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <Combobox onChange={handleSelection} as="div" className="relative">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-secondary">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <Combobox.Input
            id="search-input"
            // --- FIX #1: REMOVE the default focus outline ---
            className="w-full rounded-md border-0 bg-white/5 py-2 pl-10 pr-4 text-foreground ring-1 ring-inset ring-white/10 placeholder:text-secondary focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6 transition focus:outline-none"
            placeholder="Search..."
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
            // --- FIX #2: Clear query on blur for better dismiss behavior ---
            onBlur={() => setQuery('')}
          />
        </div>

        {/* --- FIX #2: USE Headless UI's Transition for perfect dismiss/animation --- */}
        <Transition
          as={Fragment}
          show={showResults}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options
            className="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md bg-background border border-border py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {searchResults.length === 0 ? (
              <div className="relative cursor-default select-none px-4 py-2 text-secondary">
                No results found.
              </div>
            ) : (
              searchResults.map((review) => (
                <Combobox.Option
                  key={review.slug.current}
                  value={review}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-4 ${
                      active ? 'bg-white/10 text-accent' : 'text-foreground'
                    }`
                  }
                >
                  {review.title}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
}