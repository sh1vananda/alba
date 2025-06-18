// studio/schemas/review.ts

import { defineField, defineType } from 'sanity'

// A clean way to define all attribute fields to avoid repetition
const attributeFields = [
  { name: 'storytelling', title: 'Storytelling & Narrative' },
  { name: 'character', title: 'Character Development' },
  { name: 'visuals', title: 'Visual Language' },
  { name: 'sound', title: 'Sound & Music' },
  { name: 'performances', title: 'Performances' },
  { name: 'direction', title: 'Direction & Vision' },
  { name: 'impact', title: 'Emotional Impact' },
  { name: 'themes', title: 'Themes & Subtext' },
  { name: 'execution', title: 'Technical Execution' },
  { name: 'originality', title: 'Originality & Relevance' },
].map(attr => defineField({
  name: attr.name,
  title: attr.title,
  type: 'number',
  description: 'A score from 0 to 10.',
  validation: Rule => Rule.min(0).max(10),
  fieldset: 'attributes' // This groups them all together in the UI
}));


export default defineType({
  name: 'review',
  title: 'Review',
  type: 'document',

  // Defines the collapsible group in the Sanity Studio UI
  fieldsets: [
    {
      name: 'attributes',
      title: 'Review Attributes Fingerprint',
      options: { collapsible: true, collapsed: false }
    }
  ],
  
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
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image (Widescreen)',
      type: 'image',
      description: 'Widescreen image used at the top of the review page. If not provided, the vertical poster will be used as a fallback.',
      options: { hotspot: true },
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
      title: 'Overall Score',
      type: 'number',
      description: 'The final, single score from 0 to 10.',
      validation: (Rule) => Rule.required().min(0).max(10),
    }),
    
    // The "..." spread operator inserts all 10 attribute fields here
    ...attributeFields,

    defineField({
      name: 'genres',
      title: 'Genres',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'genre' } }],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
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