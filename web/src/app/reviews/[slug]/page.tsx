// web/src/app/reviews/[slug]/page.tsx

import { client, urlFor } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { PortableTextBlock } from 'sanity'
import type { Metadata } from 'next'

// --- Interface: Add the new heroImage field ---
interface FullReview {
  title: string;
  releaseDate: string;
  score: number;
  moviePoster: SanityImageSource;
  heroImage?: SanityImageSource; // It's optional, so add '?'
  body: PortableTextBlock[];
  genres: string[];
}

type Props = {
  params: { slug: string };
}

export const revalidate = 60;

// --- Query: Fetch the new heroImage field ---
const reviewQuery = groq`*[_type == "review" && slug.current == $slug][0]{
  title,
  releaseDate,
  score,
  moviePoster,
  heroImage, // Add this line
  body,
  "genres": genres[]->title
}`

// --- Metadata: Update to use the new image for social sharing (optional but good) ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const review: FullReview = await client.fetch(reviewQuery, { slug: params.slug });
  if (!review) return { title: "Not Found" };

  const imageToUse = review.heroImage || review.moviePoster;

  return {
    title: `${review.title} | MyReviewSite`,
    description: `Read our full review of ${review.title}. Score: ${review.score}/10.`,
    openGraph: {
      images: [urlFor(imageToUse).width(1200).height(630).fit('crop').url()],
    },
  }
}

// --- Main Page Component: Update the JSX ---
export default async function ReviewPage({ params }: Props) {
  const review: FullReview = await client.fetch(reviewQuery, { slug: params.slug })

  if (!review) {
    notFound();
  }

  // --- NEW: Smartly choose which image to display ---
  const imageToDisplay = review.heroImage || review.moviePoster;

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-8">
      {/* Header with poster as background */}
      <div className="relative h-[60vh] rounded-lg overflow-hidden flex items-end p-8 text-white shadow-2xl mb-12">
        <div className="absolute inset-0">
          <Image
            src={urlFor(imageToDisplay).url()} // Use the selected image
            alt={`Background for ${review.title}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">{review.title}</h1>
          <p className="text-xl text-foreground/80 mt-2">
            {new Date(review.releaseDate).getFullYear()} <span className="mx-2">•</span> Score: {review.score}/10
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="prose prose-lg prose-invert max-w-3xl mx-auto">
        <PortableText value={review.body} />
      </div>
    </div>
  )
}