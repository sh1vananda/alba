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
import RadarChart from '@/components/RadarChart'; // RESTORED IMPORT

// --- Interfaces ---
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
  storytelling?: number;
  character?: number;
  visuals?: number;
  sound?: number;
  performances?: number;
  direction?: number;
  impact?: number;
  themes?: number;
  execution?: number;
  originality?: number;
}

interface FingerprintReview {
  _id: string;
  title: string;
  slug: { current: string };
  moviePoster: SanityImageSource;
  storytelling?: number;
  character?: number;
  visuals?: number;
  sound?: number;
  performances?: number;
  direction?: number;
  impact?: number;
  themes?: number;
  execution?: number;
  originality?: number;
}

type Props = {
  params: { slug: string };
}

export const revalidate = 60;

// --- Queries ---
const reviewQuery = groq`*[_type == "review" && slug.current == $slug][0]{
  ...,
  "genres": genres[]->{_id, title, slug}
}`

const allFingerprintsQuery = groq`*[_type == "review"]{
  _id,
  title,
  slug,
  moviePoster,
  storytelling, character, visuals, sound, performances, direction,
  impact, themes, execution, originality
}`

// --- Helper Function ---
const calculateEuclideanDistance = (fp1: number[], fp2: number[]): number => {
  let sumOfSquares = 0;
  for (let i = 0; i < fp1.length; i++) {
    sumOfSquares += (fp1[i] - fp2[i]) ** 2;
  }
  return Math.sqrt(sumOfSquares);
};

// --- Metadata ---
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

// --- Main Page Component ---
export default async function ReviewPage({ params }: Props) {
  const [review, allReviews]: [FullReview, FingerprintReview[]] = await Promise.all([
    client.fetch(reviewQuery, { slug: params.slug }),
    client.fetch(allFingerprintsQuery)
  ]);
  
  if (!review) notFound();

  // RESTORED: Prepare data for the radar chart
  const currentFingerprint = [
    review.storytelling || 0, review.character || 0, review.visuals || 0,
    review.sound || 0, review.performances || 0, review.direction || 0,
    review.impact || 0, review.themes || 0, review.execution || 0,
    review.originality || 0,
  ];
  const hasAttributeData = currentFingerprint.some(score => score > 0);

  // Calculate Similar Reviews
  const similarReviews = allReviews
    .filter(otherReview => otherReview._id !== review._id)
    .map(otherReview => {
      const otherFingerprint = [
        otherReview.storytelling || 0, otherReview.character || 0, otherReview.visuals || 0,
        otherReview.sound || 0, otherReview.performances || 0, otherReview.direction || 0,
        otherReview.impact || 0, otherReview.themes || 0, otherReview.execution || 0,
        otherReview.originality || 0,
      ];
      const distance = calculateEuclideanDistance(currentFingerprint, otherFingerprint);
      return { ...otherReview, distance };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  // RESTORED: Variable for the hero image
  const imageToDisplay = review.heroImage || review.moviePoster;

  return (
    <>
      {/* RESTORED: Act 1: The Header */}
      <div className="container mx-auto max-w-5xl p-4 md:p-8">
        <div className="relative h-[60vh] rounded-lg overflow-hidden flex items-end p-8 text-white shadow-2xl">
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
              {review.genres?.map(genre => genre?.slug && (
                <Link key={genre._id} href={`/genres/${genre.slug.current}`} className="bg-white/10 text-foreground px-3 py-1 rounded-full text-sm hover:bg-white/20 transition-colors">
                  {genre.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RESTORED: Act 2: The Visual Fingerprint */}
      {hasAttributeData && (
        <div className="container mx-auto max-w-3xl mt-4 mb-12 px-4">
          <div className="bg-background/50 border border-border p-4 rounded-lg">
            <RadarChart data={currentFingerprint} />
          </div>
        </div>
      )}

      {/* Act 3: The Written Review */}
      <div className="container mx-auto max-w-5xl px-4 md:px-8">
        <div className="prose prose-lg prose-invert max-w-3xl mx-auto">
          <PortableText value={review.body} />
        </div>
      </div>
      
      {/* Act 4: Similar Fingerprints Section */}
      {similarReviews && similarReviews.length > 0 && (
        <div className="border-t border-border mt-12 py-12">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-xl font-bold mb-5 text-center">Similar Fingerprints</h2>
            <div className="grid grid-flow-col auto-cols-max gap-4 justify-center">
              {similarReviews.map(related => (
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
  );
}