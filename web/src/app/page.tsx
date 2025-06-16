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

const reviewsQuery = groq`*[_type == "review" && defined(slug.current) && defined(moviePoster)]{
  _id,
  title,
  slug,
  moviePoster
} | order(releaseDate desc)`

export default async function HomePage() {
  const reviews: HomePageReview[] = await client.fetch(reviewsQuery);

  console.log("SERVER-SIDE FETCH:", JSON.stringify(reviews, null, 2));

  if (!reviews || reviews.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>No reviews have been published yet.</p>
      </div>
    );
  }

  return <ReviewGrid reviews={reviews} />;
}