import { isAdminOrLscsEditor, isAdminOrLscsSelf, lscsHasRole } from '@/services/access'
import type { CollectionConfig } from 'payload'
import { generateLscsMarkdownContent, cleanupMarkdownField } from '@/hooks/generateMarkdownContent'
import { slugField } from '@/fields/slug'
import {
  lexicalEditor,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  HorizontalRuleFeature,
  LinkFeature,
} from '@payloadcms/richtext-lexical'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
} from '@payloadcms/plugin-seo/fields'

export const LSCS_Articles: CollectionConfig = {
  slug: 'lscs-articles',
  admin: {
    useAsTitle: 'title',
    group: 'LSCS',
    defaultColumns: ['title', 'author', 'category', 'createdAt', 'updatedAt'],
  },
  access: {
    read: lscsHasRole,
    create: isAdminOrLscsEditor,
    update: isAdminOrLscsSelf,
    delete: isAdminOrLscsSelf,
  },
  fields: [
    { name: 'title', type: 'text', required: true },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'subtitle', type: 'text', required: true },

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
                  // console.log(rootFeatures.map((f) => f.key))
                  const filtered = rootFeatures.filter(
                    (f) =>
                      f.key !== 'relationship' &&
                      // f.key !== 'upload' &&
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
                    LinkFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              required: true,
            },
            {
              name: 'mdContent',
              type: 'textarea',
              admin: {
                hidden: true,
              },
              hooks: {
                afterRead: [generateLscsMarkdownContent],
                beforeChange: [cleanupMarkdownField],
              },
            },
          ],
        },
        {
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
          ],
          name: 'meta',
          label: 'SEO',
        },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      required: true,
      relationTo: 'lscs-article-authors',
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'relationship',
      required: true,
      relationTo: 'lscs-article-category',
      admin: { position: 'sidebar' },
    },

    {
      name: 'tags',
      type: 'text',
      required: false,
      hasMany: true,
      admin: { placeholder: 'Enter tags', position: 'sidebar' },
    },

    ...slugField('title', { slugOverrides: { required: true } }),
  ],
  versions: { drafts: true },
}
