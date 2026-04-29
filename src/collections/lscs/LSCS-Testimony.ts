import { isAdminOrLscsEditor, lscsHasRole } from '@/services/access'
import type { CollectionConfig } from 'payload'
export const LSCS_Testimony: CollectionConfig = {
  slug: 'lscs-testimony',
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
      name: 'testimony',
      type: 'textarea',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'id-number',
      type: 'text',
      required: true,
    },
    {
      name: 'position',
      type: 'text',
    },
    {
      name: 'committee',
      type: 'text',
    },
  ],
}
