// collections/Posts.ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'coverImage', // Field name in the post
      type: 'upload', // Use upload type
      relationTo: 'media', // Link to Media collection
      required: false,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}
