// web/src/app/reviews/[slug]/page.tsx

import { client, urlFor } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { PortableTextBlock } from 'sanity'
import type { Metadata } from 'next'

interface FullReview {
  _id: string;
  title: string;
  slug: { current: string };
  releaseDate: string;
  score: number;
  moviePoster: SanityImageSource;
  heroImage?: SanityImageSource;
  body: PortableTextBlock[];
  genres: Array<{ _id: string, title: string, slug: { current: string } | null }>;
}

interface RelatedReview {
  _id: string;
  title: string;
  slug: { current: string };
  moviePoster: SanityImageSource;
}

type Props = {
  params: { slug: string };
}

export const revalidate = 60;

const reviewQuery = groq`*[_type == "review" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  releaseDate,
  score,
  moviePoster,
  heroImage,
  body,
  "genres": genres[]->{_id, title, slug}
}`

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const review: FullReview = await client.fetch(reviewQuery, { slug: params.slug });
  if (!review) return { title: "Not Found" };

  const imageToUse = review.heroImage || review.moviePoster;
  return {
    title: `${review.title} | MyReviewSite`,
    description: `Read our full review of ${review.title}. Score: ${review.score}/10.`,
    openGraph: { images: [urlFor(imageToUse).width(1200).height(630).fit('crop').url()] },
  }
}

export default async function ReviewPage({ params }: Props) {
  const review: FullReview = await client.fetch(reviewQuery, { slug: params.slug })

  if (!review) {
    notFound();
  }

  const relatedByGenreQuery = groq`
    *[_type == "review" && slug.current != $currentSlug && count((genres[]->_id)[@ in $genreIds]) > 0][0...3]{
      _id, title, slug, moviePoster
    } | order(releaseDate desc)
  `;
  let relatedReviews: RelatedReview[] = await client.fetch(relatedByGenreQuery, {
    currentSlug: review.slug.current,
    genreIds: review.genres?.map(g => g._id) || [],
  });

  const needed = 3 - relatedReviews.length;
  if (needed > 0) {
    const recentReviewsQuery = groq`
      *[_type == "review" && !(_id in $excludeIds)][0...${needed}]{
        _id, title, slug, moviePoster
      } | order(releaseDate desc)
    `;
    const excludeIds = [review._id, ...relatedReviews.map(r => r._id)];
    const recentReviews: RelatedReview[] = await client.fetch(recentReviewsQuery, {
      excludeIds: excludeIds,
    });
    relatedReviews = [...relatedReviews, ...recentReviews];
  }

  const imageToDisplay = review.heroImage || review.moviePoster;

  return (
    <>
      <div className="container mx-auto max-w-5xl p-4 md:p-8">
        <div className="relative h-[60vh] rounded-lg overflow-hidden flex items-end p-8 text-white shadow-2xl mb-12">
          <div className="absolute inset-0">
            <Image
              src={urlFor(imageToDisplay).url()}
              alt={`Background for ${review.title}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">{review.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-lg">
              <span>{new Date(review.releaseDate).getFullYear()}</span>
              <span className="text-secondary">•</span>
              <span>Score: {review.score}/10</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {review.genres?.map(genre => (
                genre && genre.slug && (
                  <Link
                    key={genre._id}
                    href={`/genres/${genre.slug.current}`}
                    className="bg-white/10 text-foreground px-3 py-1 rounded-full text-sm hover:bg-white/20 transition-colors"
                  >
                    {genre.title}
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>

        <div className="prose prose-lg prose-invert max-w-3xl mx-auto">
          <PortableText value={review.body} />
        </div>
      </div>

      {relatedReviews && relatedReviews.length > 0 && (
        <div className="border-t border-border mt-12 py-12">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-xl font-bold mb-5 text-left">Read Next</h2>
            
            <div className="grid grid-flow-col auto-cols-max gap-4 justify-left">
              
              {relatedReviews.map(related => (
                <Link key={related._id} href={`/reviews/${related.slug.current}`} className="group">
                  
                  <div className="w-40"> 
                    <div className="overflow-hidden rounded-md aspect-[2/3] bg-gray-800">
                      <Image
                        src={urlFor(related.moviePoster).width(300).height(450).url()}
                        alt={`Poster for ${related.title}`}
                        width={300}
                        height={450}
                        className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
                      />
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}