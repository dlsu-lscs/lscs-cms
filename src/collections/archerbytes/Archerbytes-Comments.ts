import { isAdminOrLscsEditor, isAdminOrLscsSelf, lscsHasRole } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const Archerbytes_Comments: CollectionConfig = {
  slug: 'archerbytes-comments',
  admin: {
    useAsTitle: 'content',
    group: 'Archerbytes',
    defaultColumns: ['content', 'user', 'article', 'createdAt'],
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
      name: 'article',
      type: 'relationship',
      required: true,
      relationTo: 'archerbytes-articles',
      admin: { position: 'sidebar' },
    },
    {
      name: 'replyTo',
      type: 'relationship',
      required: false,
      relationTo: 'archerbytes-comments',
      admin: {
        position: 'sidebar',
        description: 'Reply to another comment for threaded discussions',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        placeholder: 'Write your comment...',
      },
    },
  ],
}
