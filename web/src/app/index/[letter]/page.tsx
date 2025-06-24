// web/src/app/index/[letter]/page.tsx

import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import ReviewGrid from '@/components/ReviewGrid'
import type { Metadata } from 'next'

interface Review {
  _id: string;
  title: string;
  slug: { current: string };
  moviePoster: SanityImageSource;
}

type Props = {
  params: { letter: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const letter = params.letter.toUpperCase();
  return {
    title: `Index: ${letter} | Anatomy of a Scream`,
    description: `A list of all reviews starting with the letter ${letter}.`,
  }
}

export default async function IndexPage({ params }: Props) {
  const letter = params.letter.toLowerCase();
  
  if (letter.length !== 1 || !/^[a-z]$/.test(letter)) {
    notFound();
  }

  const allReviewsQuery = groq`
    *[_type == "review" && defined(slug.current) && defined(title)]{
      _id,
      title,
      slug,
      moviePoster
    }
  `
  const allReviews: Review[] = await client.fetch(allReviewsQuery);

  const reviews = allReviews
    .filter(review => 
      review.title.trim().toLowerCase().startsWith(letter)
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="container mx-auto p-4 md-p-8">
      <h1 className="text-4xl font-heading tracking-wider mb-8">
        <span className="text-secondary font-sans text-3xl">Index:</span> {letter.toUpperCase()}
      </h1>
      {reviews && reviews.length > 0 ? (
        <ReviewGrid reviews={reviews} />
      ) : (
        <p className="text-secondary">
          No reviews found starting with the letter {'"'}
          {letter.toUpperCase()}
          {'"'}.
        </p>
      )}
    </div>
  )
}