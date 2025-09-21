import { isAuthenticated, isAdminOrEditor, isAdminOrSelf } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const SGAR_Committees: CollectionConfig = {
  slug: 'sgar-committees',
  admin: {
    useAsTitle: 'committee-name',
    group: 'SGAR',
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
    { name: 'committee-name', type: 'text', required: true },
    {
      name: 'unit',
      type: 'relationship',
      relationTo: 'sgar-units',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        rows: 10,
      },
    },
    {
      name: 'available-positions',
      type: 'relationship',
      relationTo: 'sgar-positions',
      required: true,
      hasMany: true,
    },
  ],
}
