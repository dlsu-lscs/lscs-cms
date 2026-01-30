import { isAdminOrLscsEditor, isAdminOrLscsSelf, lscsHasRole } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const LSCS_Awards: CollectionConfig = {
  slug: 'lscs-awards',
  admin: {
    useAsTitle: 'awardName',
    group: 'LSCS',
    defaultColumns: ['awardName', 'year', 'projectName', 'rank', 'updatedAt'],
  },
  access: {
    read: lscsHasRole,
    create: isAdminOrLscsEditor,
    update: isAdminOrLscsSelf,
    delete: isAdminOrLscsSelf,
  },
  fields: [
    {
      name: 'awardName',
      type: 'text',
      required: true,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      min: 1900,
      max: 2100,
    },
    {
      name: 'projectName',
      type: 'text',
      required: true,
    },
    {
      name: 'rank',
      type: 'text',
      required: true,
    },
  ],
}
