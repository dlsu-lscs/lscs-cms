import { isAuthenticated, isAdminOrEditor, isAdminOrSelf } from '@/services/access'
import type { CollectionConfig } from 'payload'
import { generateMarkdownContent, cleanupMarkdownField } from '@/hooks/generateMarkdownContent'

import {
  lexicalEditor,
  defaultEditorFeatures,
  UploadFeature,
  RelationshipFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  BlocksFeature,
  HorizontalRuleFeature,
} from '@payloadcms/richtext-lexical'
import { Banner } from '@payloadcms/ui'

export const LSCS_Articles: CollectionConfig = {
  slug: 'lscs-articles',
  admin: {
    useAsTitle: 'title',
    group: 'LSCS',
  },
  access: {
    // Only authenticated users can read user data
    read: isAuthenticated,
    // Only admins can create new users
    create: isAdminOrEditor,
    // Users can update their own profile, admins can update anyone
    update: isAdminOrSelf,
    // Only admins can delete users
    delete: isAdminOrSelf,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'subtitle', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          required: true,
          relationTo: 'lscs-article-category',
        },
        {
          name: 'author',
          type: 'relationship',
          required: true,
          relationTo: 'lscs-article-authors',
        },
        {
          name: 'tags',
          type: 'text',
          required: false,
          hasMany: true,
          admin: { placeholder: 'Enter tags' },
        },
      ],
    },

    {
      name: 'featuredImage',
      type: 'relationship',
      required: false,
      relationTo: 'media',
      admin: { placeholder: 'Select Images' },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          console.log(rootFeatures.map((f) => f.key))
          const filtered = rootFeatures.filter(
            (f) =>
              f.key !== 'relationship' &&
              f.key !== 'upload' &&
              f.key !== 'align' &&
              f.key !== 'indent' &&
              f.key !== 'subscript' &&
              f.key !== 'superscript',
          )
          return [
            ...filtered,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature({
              // remove alignment buttons
            }),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      required: true,
    },
    {
      name: 'md-content',
      type: 'textarea',
      admin: {
        hidden: true,
      },
      hooks: {
        afterRead: [generateMarkdownContent],
        beforeChange: [cleanupMarkdownField],
      },
    },
  ],
  versions: { drafts: true },
}
