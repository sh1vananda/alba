// web/src/components/ScareOMeter.tsx

"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.client';
import { ScareReview } from '@/app/explore/scare-o-meter/page';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

export default function ScareOMeter({ reviews }: { reviews: ScareReview[] }) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  const filteredReviews = selectedScore === null
    ? reviews
    : reviews.filter(review => Math.round(review.mainBooGauge) === selectedScore);

  const meterLevels = Array.from({ length: 11 }, (_, i) => i);

  return (
    <div>
      <div className="flex justify-between items-center bg-background/50 border border-border rounded-lg p-2 mb-8">
        {meterLevels.map(score => {
          const isActive = selectedScore === score;
          return (
            <button
              key={score}
              onClick={() => setSelectedScore(prev => prev === score ? null : score)}
              className={`w-full h-10 rounded-md text-sm font-bold transition-colors duration-200
                ${isActive ? 'bg-accent text-background' : 'hover:bg-white/10'}`}
            >
              {score}
            </button>
          );
        })}
      </div>

      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <AnimatePresence>
          {filteredReviews.map((review) => (
            <motion.div
              layout
              key={review._id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/reviews/${review.slug.current}`}
                className="group block rounded-lg overflow-hidden relative"
              >
                <Image
                  src={urlFor(review.moviePoster).width(500).height(750).url()}
                  alt={`Poster for ${review.title}`}
                  width={500}
                  height={750}
                  className="w-full h-auto object-cover"
                />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {filteredReviews.length === 0 && selectedScore !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <p className="text-secondary">No reviews found with a Boo Gauge rating of {selectedScore}.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}