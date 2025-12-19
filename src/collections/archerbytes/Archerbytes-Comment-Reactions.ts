import { isAdminOrLscsEditor, isAdminOrLscsSelf, lscsHasRole } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const Archerbytes_Comment_Reactions: CollectionConfig = {
  slug: 'archerbytes-comment-reactions',
  admin: {
    useAsTitle: 'id',
    group: 'Archerbytes',
    defaultColumns: ['user', 'comment', 'reactionType', 'createdAt'],
  },
  access: {
    read: lscsHasRole,
    create: lscsHasRole,
    update: isAdminOrLscsSelf,
    delete: isAdminOrLscsSelf,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      required: true,
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    {
      name: 'comment',
      type: 'relationship',
      required: true,
      relationTo: 'archerbytes-comments',
      admin: { position: 'sidebar' },
    },
    {
      name: 'reactionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Like', value: 'like' },
        { label: 'Heart', value: 'heart' },
        { label: 'Care', value: 'care' },
        { label: 'Haha', value: 'haha' },
        { label: 'Wow', value: 'wow' },
        { label: 'Sad', value: 'sad' },
        { label: 'Angry', value: 'angry' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  indexes: [
    {
      fields: ['user', 'comment'],
      unique: true,
    },
  ],
}
