import type { CollectionConfig } from 'payload'
import { isAuthenticated, isAdminOrEditor, isAdminOrSelf } from '@/services/access'

export const SGAR_Exec_Board: CollectionConfig = {
  slug: 'sgar_exec_board',
  admin: {
    useAsTitle: 'full_name',
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
    { name: 'full_name', type: 'text', required: true },
    {
      name: 'contact',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'position',
      type: 'relationship',
      relationTo: 'sgar_positions',
      required: true,
    },
  ],
}
