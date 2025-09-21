import { isAuthenticated, isAdminOrEditor, isAdminOrSelf } from '@/services/access'
import type { CollectionConfig } from 'payload'
import { generateMarkdownContent, cleanupMarkdownField } from '@/hooks/generateMarkdownContent'

import {
  lexicalEditor,
  defaultEditorFeatures,
  UploadFeature,
  RelationshipFeature,
} from '@payloadcms/richtext-lexical'

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
    { name: 'title', type: 'text', required: true },
    {
      name: 'subtitle',
      type: 'text',
      required: true,
    },
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
        features: () =>
          defaultEditorFeatures.filter(
            (feature) =>
              feature.key !== UploadFeature().key && feature.key !== RelationshipFeature().key,
          ),
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
