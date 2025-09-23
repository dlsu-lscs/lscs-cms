import { hasRole, isAdminOrEditor, isAdminOrSelf, isAuthenticated } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',

  access: {
    // Only authenticated users can read user data
    read: hasRole,
    // Only admins can create new users
    create: isAdminOrEditor,
    // Users can update their own profile, admins can update anyone
    update: isAdminOrSelf,
    // Only admins can delete users
    delete: isAdminOrSelf,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
