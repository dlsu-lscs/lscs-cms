import { isAuthenticated, isAdminOrEditor, isAdminOrSelf } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const SGAR_Units: CollectionConfig = {
  slug: 'sgar_units',
  admin: {
    useAsTitle: 'unit_name',
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
    { name: 'unit_name', type: 'text', required: true },
    {
      name: 'acronym',
      type: 'text',
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
      name: 'form-link',
      type: 'text',
      required: true,
    },
  ],
}
