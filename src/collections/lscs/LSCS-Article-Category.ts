import { isAuthenticated, isAdminOrEditor, isAdminOrSelf } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const LSCS_Article_Category: CollectionConfig = {
  slug: 'lscs-article-category',
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
  fields: [{ name: 'name', type: 'text', required: true }],
}
