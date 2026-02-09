import { isAdminOrLscsEditor, lscsHasRole } from '@/services/access'
import type { CollectionConfig } from 'payload'

export const LSCS_Web_Assets: CollectionConfig = {
  slug: 'lscs-web-assets',
  admin: {
    useAsTitle: 'title',
    group: 'LSCS',
    defaultColumns: ['title', 'updatedAt'],
  },
  access: {
    read: lscsHasRole,
    create: isAdminOrLscsEditor,
    update: isAdminOrLscsEditor,
    delete: isAdminOrLscsEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Website Assets',
    },
    {
      type: 'group',
      name: 'hero',
      label: 'Hero Section',
      fields: [
        {
          name: 'image',
          type: 'upload',
          required: false,
          relationTo: 'media',
          label: 'Hero Image',
        },
      ],
    },
    {
      type: 'group',
      name: 'whoAreWe',
      label: 'Who Are We Section',
      fields: [
        {
          name: 'image',
          type: 'upload',
          required: false,
          relationTo: 'media',
          label: 'Image',
        },
      ],
    },
    {
      type: 'group',
      name: 'whatWeDo',
      label: 'What We Do Section',
      fields: [
        {
          name: 'image1',
          type: 'upload',
          required: false,
          relationTo: 'media',
          label: 'Image 1',
        },
        {
          name: 'image2',
          type: 'upload',
          required: false,
          relationTo: 'media',
          label: 'Image 2',
        },
        {
          name: 'image3',
          type: 'upload',
          required: false,
          relationTo: 'media',
          label: 'Image 3',
        },
        {
          name: 'image4',
          type: 'upload',
          required: false,
          relationTo: 'media',
          label: 'Image 4',
        },
      ],
    },
    {
      type: 'group',
      name: 'about',
      label: 'About Section',
      fields: [
        {
          name: 'images',
          type: 'array',
          required: false,
          label: 'Images',
          fields: [
            {
              name: 'image',
              type: 'upload',
              required: true,
              relationTo: 'media',
            },
          ],
        },
      ],
    },
  ],
}
