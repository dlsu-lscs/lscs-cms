import { isAdminOrLscsEditor, isAdminOrLscsSelf, lscsHasRole } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const LSCS_Article_Category: CollectionConfig = {
  slug: 'lscs-article-category',
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
  fields: [{ name: 'name', type: 'text', required: true }],
}
