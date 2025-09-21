import { isAuthenticated, isAdminOrEditor, isAdminOrSelf } from '@/services/access'
import { CollectionConfig } from 'payload'

export const LSCS_Article_Authors: CollectionConfig = {
  slug: 'lscs-article-authors',
  admin: {
    useAsTitle: 'name',
    group: 'LSCS',
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
    { name: 'name', type: 'text', required: true },
    { name: 'bio', type: 'textarea' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'user', type: 'relationship', relationTo: 'users' }, // optional link to actual user
  ],
}
