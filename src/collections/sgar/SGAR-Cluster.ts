import { isAdminOrEditor, isAdminOrSelf, isAuthenticated } from '@/services/access'
import { CollectionConfig } from 'payload'

export const SGAR_Clusters: CollectionConfig = {
  slug: 'sgar-clusters',
  admin: {
    useAsTitle: 'cluster-name',
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
  fields: [{ name: 'cluster-name', required: true, type: 'text' }],
}
