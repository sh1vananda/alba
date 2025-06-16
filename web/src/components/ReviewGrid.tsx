// web/src/components/ReviewGrid.tsx

"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { urlFor } from '@/lib/sanity.client';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface Review {
  _id: string;
  title: string;
  slug: { current: string };
  moviePoster: SanityImageSource;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.075 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

export default function ReviewGrid({ reviews }: { reviews: Review[] }) {
  console.log("CLIENT-SIDE PROPS RECEIVED:", reviews);
  
  if (!reviews || reviews.length === 0) {
    return <p className="text-center p-4">No reviews to display.</p>;
  }

  return (
    <motion.div
      className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {reviews.map((review) => (
        <motion.div key={review._id} variants={itemVariants}>
          <Link
            href={`/reviews/${review.slug.current}`}
            className="group block rounded-lg overflow-hidden relative"
          >
            <Image
              src={urlFor(review.moviePoster).width(500).height(750).url()}
              alt={`Poster for ${review.title}`}
              width={500}
              height={750}
              className="w-full h-auto object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <h3 className="text-white text-lg font-bold">{review.title}</h3>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}