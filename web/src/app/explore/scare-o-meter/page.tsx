// web/src/app/explore/scare-o-meter/page.tsx

import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { Metadata } from 'next'
import ScareOMeter from '@/components/ScareOMeter'

export const metadata: Metadata = {
  title: 'Scare-O-Meter | Godrotted',
  description: 'Explore horror reviews by their Boo Gauge score.',
}

export interface ScareReview {
  _id: string;
  title: string;
  slug: { current: string };
  moviePoster: SanityImageSource;
  mainBooGauge: number;
}

const allReviewsQuery = groq`
  *[_type == "review" && defined(slug.current) && defined(moviePoster) && defined(mainBooGauge)]{
    _id,
    title,
    slug,
    moviePoster,
    mainBooGauge
  } | order(title asc)
`

export default async function ScareOMeterPage() {
  const reviews: ScareReview[] = await client.fetch(
    allReviewsQuery,
    {},
    { next: { revalidate: 0 } }
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading tracking-wider">Scare-O-Meter</h1>
        <p className="text-secondary mt-2 max-w-2xl mx-auto">
          Select a scare level on the meter below to find reviews with a matching Boo Gauge score.
        </p>
      </div>
      
      <ScareOMeter reviews={reviews} />
    </div>
  )
}