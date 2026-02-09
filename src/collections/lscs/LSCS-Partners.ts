import { isAdminOrLscsEditor, lscsHasRole } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const LSCS_Partners: CollectionConfig = {
  slug: 'lscs-partners',
  admin: {
    useAsTitle: 'name',
    group: 'LSCS',
    defaultColumns: ['name', 'updatedAt'],
  },
  access: {
    read: lscsHasRole,
    create: isAdminOrLscsEditor,
    update: isAdminOrLscsEditor,
    delete: isAdminOrLscsEditor,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      required: true,
      relationTo: 'media',
    },
  ],
}
