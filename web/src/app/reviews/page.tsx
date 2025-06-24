// web/src/app/reviews/page.tsx

import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import ReviewGrid from '@/components/ReviewGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Reviews | Anatomy of a Scream',
  description: 'An alphabetical list of all reviews.',
}

interface Review {
  _id: string;
  title: string;
  slug: { current: string };
  moviePoster: SanityImageSource;
}

const allReviewsQuery = groq`*[_type == "review" && defined(slug.current)] | order(title asc){
  _id,
  title,
  slug,
  moviePoster
}`

export default async function AllReviewsPage() {
  const reviews: Review[] = await client.fetch(allReviewsQuery);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-heading tracking-wider mb-8">All Reviews</h1>
      {reviews && reviews.length > 0 ? (
        <ReviewGrid reviews={reviews} />
      ) : (
        <p className="text-secondary">No reviews have been published yet.</p>
      )}
    </div>
  )
}