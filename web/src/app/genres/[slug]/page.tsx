// web/src/app/genres/[slug]/page.tsx

import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import ReviewGrid from '@/components/ReviewGrid'
import type { Metadata, ResolvingMetadata } from 'next'

// --- Interfaces and Props ---

// Interface for the fetched Genre data
interface Genre {
  title: string;
}

// Interface for the fetched Review data
interface Review {
  _id: string;
  title: string;
  slug: { current: string };
  moviePoster: SanityImageSource;
}

// Type specifically for the props of the Page and generateMetadata functions
// This is the most critical part of the fix.
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// --- Queries ---
const genreQuery = groq`*[_type == "genre" && slug.current == $slug][0]{ title }`
const reviewsByGenreQuery = groq`
  *[_type == "review" && references(*[_type=="genre" && slug.current == $slug]._id)] | order(releaseDate desc){
    _id,
    title,
    slug,
    moviePoster
  }
`

// --- generateMetadata function with the explicit Props type ---
export async function generateMetadata(
  { params }: Props,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parent: ResolvingMetadata
): Promise<Metadata> {
  const genre: Genre = await client.fetch(genreQuery, { slug: params.slug });
  if (!genre) return { title: "Not Found" };
  
  return {
    title: `${genre.title} Reviews`,
    description: `A collection of reviews in the ${genre.title} genre.`,
  }
}

// --- Main Page Component with the explicit Props type ---
export default async function GenrePage({ params }: Props) {
  const genre: Genre = await client.fetch(genreQuery, { slug: params.slug });

  if (!genre) {
    notFound();
  }

  const reviews: Review[] = await client.fetch(reviewsByGenreQuery, { slug: params.slug });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8">
        <span className="text-secondary">Genre:</span> {genre.title}
      </h1>
      {reviews && reviews.length > 0 ? (
        <ReviewGrid reviews={reviews} />
      ) : (
        <p>No reviews found for this genre yet.</p>
      )}
    </div>
  )
}