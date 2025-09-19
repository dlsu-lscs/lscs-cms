import { isAuthenticated, isAdminOrEditor, isAdminOrSelf } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const SGAR_Media: CollectionConfig = {
  slug: 'sgar_media',
  admin: {
    useAsTitle: 'unit_name',
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
      name: 'unit',
      type: 'relationship',
      relationTo: 'sgar_units',
      required: true,
    },
    {
      name: 'asset',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'media_type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Logo',
          value: 'logo',
        },
        {
          label: 'Main Pub',
          value: 'main_pub',
        },
        {
          label: 'Org Chart',
          value: 'org_chart',
        },
      ],
      defaultValue: 'draft',
    },
  ],
}
