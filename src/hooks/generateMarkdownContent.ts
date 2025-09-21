import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { FieldHook, RichTextField } from 'payload'
import { convertLexicalToMarkdown, editorConfigFactory } from '@payloadcms/richtext-lexical'

export const generateMarkdownContent: FieldHook = async ({
  data,
  req,
  siblingData,
  siblingFields,
}) => {
  const contentData: SerializedEditorState = siblingData['content']

  if (!contentData) {
    return ''
  }

  const markdown = convertLexicalToMarkdown({
    data: contentData,
    editorConfig: editorConfigFactory.fromField({
      field: siblingFields.find(
        (field) => 'name' in field && field.name === 'content',
      ) as RichTextField,
    }),
  })

  // Get populated relationship data
  let categoryName = ''
  let authorName = ''
  let featuredImageUrl = ''

  try {
    // Populate category
    if (siblingData.category && typeof siblingData.category === 'number') {
      const categoryDoc = (await req.payload.findByID({
        collection: 'lscs-article-category',
        id: siblingData.category,
      })) as any
      categoryName = categoryDoc?.name || categoryDoc?.title || ''
    } else if (typeof siblingData.category === 'object') {
      const cat = siblingData.category as any
      categoryName = cat?.name || cat?.title || ''
    }

    // Populate author
    if (siblingData.author && typeof siblingData.author === 'number') {
      const authorDoc = (await req.payload.findByID({
        collection: 'lscs-article-authors',
        id: siblingData.author,
      })) as any
      authorName = `${authorDoc?.name || ''}`.trim()
    } else if (typeof siblingData.author === 'object') {
      const auth = siblingData.author as any
      authorName = `${auth?.name || ''}`.trim()
    }

    // Populate featured image
    if (siblingData.featuredImage && typeof siblingData.featuredImage === 'number') {
      const imageDoc = (await req.payload.findByID({
        collection: 'media',
        id: siblingData.featuredImage,
      })) as any
      featuredImageUrl = imageDoc?.url || ''
    } else if (typeof siblingData.featuredImage === 'object') {
      const img = siblingData.featuredImage as any
      featuredImageUrl = img?.url || ''
    }
  } catch (error) {
    console.error('Error populating relationship data:', error)
  }

  const meta = `---
title: ${siblingData.title}
subtitle: ${siblingData.subtitle}
category: ${categoryName}
author: ${authorName}
tags: [${siblingData.tags ? siblingData.tags.map((tag: string) => `"${tag}"`).join(', ') : ''}]
featuredImage: ${featuredImageUrl}
date: ${siblingData.createdAt}
updated: ${siblingData.updatedAt}
---

`
  return meta + markdown
}

export const cleanupMarkdownField: FieldHook = ({ siblingData }) => {
  // Ensure that the markdown field is not saved in the database
  delete siblingData['md-content']
  return null
}
