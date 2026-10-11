import { isAdminOrEditor, isAuthenticated } from '@/services/access'
import { CollectionConfig } from 'payload'

export const SGAR_Clusters: CollectionConfig = {
  slug: 'sgar-clusters',
  admin: {
    useAsTitle: 'cluster-name',
    group: 'SGAR',
  },
  access: {
    // Only authenticated users can read SGAR data
    read: isAuthenticated,
    // Admins and editors can manage SGAR data
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [{ name: 'cluster-name', required: true, type: 'text' }],
}
