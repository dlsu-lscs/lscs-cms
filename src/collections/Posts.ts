// collections/Posts.ts
import { isAuthenticated, isAdminOrSelf, isAdminOrEditor } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    // Only authenticated users can read user data
    read: isAuthenticated,
    // Only admins can create new users
    create: isAdminOrEditor,
    // Users can update their own profile, admins can update anyone
    update: isAdminOrSelf,
    // Only admins can delete users
    delete: isAdminOrSelf,
  },
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
