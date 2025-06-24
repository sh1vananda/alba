// web/src/app/genres/[slug]/page.tsx

import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import ReviewGrid from '@/components/ReviewGrid'
import type { Metadata, ResolvingMetadata } from 'next'

interface Genre {
  title: string;
}

interface Review {
  _id: string;
  title: string;
  slug: { current: string };
  moviePoster: SanityImageSource;
}

type PageProps = {
  params: { slug: string };
};

const genreQuery = groq`*[_type == "genre" && slug.current == $slug][0]{ title }`
const reviewsByGenreQuery = groq`
  *[_type == "review" && references(*[_type=="genre" && slug.current == $slug]._id)] | order(releaseDate desc){
    _id,
    title,
    slug,
    moviePoster
  }
`

export async function generateMetadata(
  { params }: PageProps,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const genre: Genre = await client.fetch(genreQuery, { slug: params.slug });
  if (!genre) return { title: "Not Found" };
  
  return {
    title: `${genre.title} Reviews | Anatomy of a Scream`,
    description: `A collection of reviews in the ${genre.title} genre.`,
  }
}

export default async function GenrePage({ params }: PageProps) {
  const genre: Genre = await client.fetch(genreQuery, { slug: params.slug });

  if (!genre) {
    notFound();
  }

  const reviews: Review[] = await client.fetch(reviewsByGenreQuery, { slug: params.slug });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-heading tracking-wider mb-8">
        <span className="text-secondary font-sans">Genre:</span> {genre.title}
      </h1>
      {reviews && reviews.length > 0 ? (
        <ReviewGrid reviews={reviews} />
      ) : (
        <p>No reviews found for this genre yet.</p>
      )}
    </div>
  )
}