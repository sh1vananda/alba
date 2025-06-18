import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import review from './schemas/review'
import genre from './schemas/genre'
import blockContent from './schemas/blockContent'

export default defineConfig({
  name: 'default',
  title: 'Anatomy of a Scream | Studio',

  projectId: 'wdir2d6w',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [review, genre, blockContent],
  },
})
