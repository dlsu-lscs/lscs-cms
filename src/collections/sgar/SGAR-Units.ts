import { isAuthenticated, isAdminOrEditor, isAdminOrSelf } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const SGAR_Units: CollectionConfig = {
  slug: 'sgar-units',
  admin: {
    useAsTitle: 'unit-name',
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
    {
      type: 'row',
      fields: [
        { name: 'unit-name', type: 'text', required: true },
        {
          name: 'slug',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            rows: 5,
          },
        },
        {
          name: 'form-link',
          type: 'text',
          required: true,
        },
      ],
    },

    // Reverse relationships - show related records
    {
      name: 'media',
      type: 'join',
      collection: 'sgar-media',
      on: 'sgar-unit',
      maxDepth: 2,
      admin: {
        description: 'Media files associated with this unit (logo, publications, etc.)',
      },
    },
    {
      name: 'executives',
      type: 'join',
      collection: 'sgar-exec-board',
      on: 'unit',
      maxDepth: 2,
      admin: {
        description: 'Executive board members for this unit',
      },
    },
    {
      name: 'committees',
      type: 'join',
      collection: 'sgar-committees',
      on: 'unit',
      maxDepth: 2,
      admin: {
        description: 'Committees under this unit',
      },
    },
  ],
}
