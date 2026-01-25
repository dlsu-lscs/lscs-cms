import { isAdminOrLscsEditor, isAdminOrLscsSelf, lscsHasRole } from '@/services/access'
import { CollectionConfig } from 'payload'

export const LSCS_Article_Authors: CollectionConfig = {
  slug: 'lscs-article-authors',
  admin: {
    useAsTitle: 'name',
    group: 'LSCS',
  },
  access: {
    read: lscsHasRole,
    create: isAdminOrLscsEditor,
    update: isAdminOrLscsSelf,
    delete: isAdminOrLscsSelf,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'bio', type: 'textarea' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'user', type: 'relationship', relationTo: 'users' }, // optional link to actual user
  ],
}
