// web/src/lib/sanity.client.ts

import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

// These are the same variables from your .env.local file
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION!

// This is the client that will be used to fetch data in your components
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // useCdn: false is vital for development to see changes immediately
  useCdn: false,
})

// Helper function for generating image URLs with the correct project ID
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}