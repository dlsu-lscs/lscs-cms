import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { FieldHook, RichTextField } from 'payload'
import { convertLexicalToMarkdown, editorConfigFactory } from '@payloadcms/richtext-lexical'

// TODO
// Seperate the logic of custom meta data in the MD for LSCS articles to
// its own hook

async function processLexicalUploads(
  contentData: SerializedEditorState,
  req: any,
): Promise<SerializedEditorState> {
  const processNode = async (node: any): Promise<any> => {
    if (node.type === 'upload' && node.value) {
      // Fetch the media document
      try {
        // node.value can be either the ID directly (number) or an object with id property
        const mediaId = typeof node.value === 'object' ? node.value.id : node.value

        const mediaDoc = await req.payload.findByID({
          collection: 'media',
          id: mediaId,
        })

        // Minimal non-sensitive log: media id and filename
        console.info('media fetched for markdown conversion', mediaDoc.id, mediaDoc.filename)

        // Keep the URL encoded for now, will decode after markdown conversion
        const imageUrl = mediaDoc.url || ''

        // Replace the upload node with a paragraph containing the markdown image syntax
        // This is necessary because root nodes can only contain block-level elements
        return {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              text: `![${mediaDoc.alt || 'Image'}](${imageUrl})`,
              format: 0,
              version: 1,
            },
          ],
          direction: null,
          textFormat: 0,
        }
      } catch (error) {
        return node
      }
    }

    // Recursively process children
    if (node.children && Array.isArray(node.children)) {
      node.children = await Promise.all(node.children.map(processNode))
    }

    return node
  }

  // Create a deep copy of the entire content data to avoid mutating the original
  const processed = JSON.parse(JSON.stringify(contentData))
  if (processed.root?.children) {
    processed.root.children = await Promise.all(processed.root.children.map(processNode))
  }

  return processed
}

export const generateLscsMarkdownContent: FieldHook = async ({
  data,
  req,
  siblingData,
  siblingFields,
}) => {
  const contentData: SerializedEditorState = siblingData['content']

  if (!contentData) {
    return ''
  }

  const processedContent = await processLexicalUploads(contentData, req)

  const markdown = convertLexicalToMarkdown({
    data: processedContent,
    editorConfig: editorConfigFactory.fromField({
      field: siblingFields.find(
        (field) => 'name' in field && field.name === 'content',
      ) as RichTextField,
    }),
  })

  // Decode URLs in the markdown to prevent escaped underscores
  // This replaces encoded URLs with decoded versions after markdown conversion
  const decodedMarkdown = markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    // Decode the URL but keep the markdown syntax intact
    const decodedUrl = decodeURIComponent(url)
    const removeEsc = decodedUrl.replace(/\\_/g, '_')
    return `![${alt}](${removeEsc})`
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
    // swallow relationship population errors to avoid blocking save
  }

  const meta = `---
title: '${siblingData.title}'
subtitle: '${siblingData.subtitle}'
category: '${categoryName}'
author: '${authorName}'
tags: [${siblingData.tags ? siblingData.tags.map((tag: string) => `"${tag}"`).join(', ') : ''}]
featuredImage: '${featuredImageUrl}'
date: '${siblingData.createdAt}'
updated: '${siblingData.updatedAt}'
---

`
  return meta + decodedMarkdown
}

export const cleanupMarkdownField: FieldHook = ({ siblingData }) => {
  // Ensure that the markdown field is not saved in the database
  delete siblingData['md_content']
  return null
}
