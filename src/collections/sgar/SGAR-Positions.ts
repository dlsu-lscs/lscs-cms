import { isAuthenticated, isAdminOrEditor, isAdminOrSelf } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const SGAR_Positions: CollectionConfig = {
  slug: 'sgar_positions',
  admin: {
    useAsTitle: 'position',
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
    { name: 'position', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'open', value: 'open' },
        { label: 'closed', value: 'closed' },
      ],
    },
    {
      name: 'application_process',
      type: 'textarea',
      required: true,
      admin: {
        rows: 10,
      },
    },
  ],
}
