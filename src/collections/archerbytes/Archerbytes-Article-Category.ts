import { isAdminOrLscsEditor, isAdminOrLscsSelf, lscsHasRole } from '@/services/access'
import type { CollectionConfig } from 'payload'
import { afterChangeArcherbytesCategory, afterDeleteArcherbytesCategory } from '@/lib/webhooks/archerbytes-hooks'

export const Archerbytes_Article_Category: CollectionConfig = {
  slug: 'archerbytes-article-category',
  admin: {
    useAsTitle: 'name',
    group: 'Archerbytes',
  },
  access: {
    read: lscsHasRole,
    create: isAdminOrLscsEditor,
    update: isAdminOrLscsSelf,
    delete: isAdminOrLscsSelf,
  },
  fields: [{ name: 'name', type: 'text', required: true }],
  hooks: {
    afterChange: [afterChangeArcherbytesCategory],
    afterDelete: [afterDeleteArcherbytesCategory],
  },
}
