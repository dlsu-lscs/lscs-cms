import { isAuthenticated, isAdminOrEditor, isAdminOrSelf } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const SGAR_Media: CollectionConfig = {
  slug: 'sgar-media',
  admin: { group: 'SGAR' },
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
    {
      name: 'sgar-unit',
      type: 'relationship',
      relationTo: 'sgar-units',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'main-pub',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
}
