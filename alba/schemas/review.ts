// studio/schemas/review.ts

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Movie Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'moviePoster',
      title: 'Movie Poster (Vertical)',
      type: 'image',
      description: 'Used for homepage grid and social sharing. Should be a vertical poster.',
      options: {
        hotspot: true, // This is fantastic for frontend cropping control
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image (Widescreen)',
      type: 'image',
      description: 'Widescreen image used at the top of the review page. (e.g., a movie still). If not provided, the vertical poster will be used as a fallback.',
      options: {
        hotspot: true,
      },
      // This field is optional
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
    }),
    defineField({
      name: 'director',
      title: 'Director',
      type: 'string',
    }),
    defineField({
      name: 'score',
      title: 'Score',
      type: 'number',
      description: 'A score from 0 to 10. Can use decimals.',
      validation: (Rule) => Rule.required().min(0).max(10),
    }),
    defineField({
      name: 'genres',
      title: 'Genres',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'genre' } }],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent', // This is Sanity's rich text editor
    }),
  ],

  // Enhanced Admin Preview
  preview: {
    select: {
      title: 'title',
      releaseDate: 'releaseDate',
      score: 'score',
      media: 'moviePoster',
    },
    prepare(selection) {
      const { title, releaseDate, score, media } = selection
      const year = releaseDate ? new Date(releaseDate).getFullYear() : 'Date TBD'
      const scoreDisplay = typeof score === 'number' ? `${score}/10` : 'Not Scored'
      
      return {
        title: title,
        subtitle: `${year} | Score: ${scoreDisplay}`,
        media: media,
      }
    },
  },
})