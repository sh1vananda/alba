// web/src/app/page.tsx

import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import ReviewGrid from '@/components/ReviewGrid'

interface HomePageReview {
  _id: string;
  title: string;
  slug: { current: string };
  moviePoster: SanityImageSource;
}

export const revalidate = 60;

const reviewsQuery = groq`
  *[_type == "review" && defined(slug.current) && defined(moviePoster)] | order(releaseDate desc)[0...8]{
    _id,
    title,
    slug,
    moviePoster
  }
`

export default async function HomePage() {
  const reviews: HomePageReview[] = await client.fetch(reviewsQuery);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold">No reviews have been published yet.</h2>
        <p className="text-secondary mt-2">Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 text-center">
      <h1 className="text-4xl font-bold mb-8">Recently Autopsied</h1>
      <ReviewGrid reviews={reviews} />
    </div>
  );
}