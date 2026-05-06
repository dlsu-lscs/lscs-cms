import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

type ArcherbytesWebhookAction = 'created' | 'updated' | 'deleted'

interface ArcherbytesWebhookPayload {
  event: 'article' | 'category'
  action: ArcherbytesWebhookAction
  articleId?: string
  categoryId?: string
  timestamp: string
  cms: 'payload-cms'
}

let warnedMissingArcherbytesConfig = false

function coerceIdToString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'bigint') return String(value)
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return coerceIdToString((value as { id?: unknown }).id)
  }
  return undefined
}

async function sendArcherbytesWebhook(payload: ArcherbytesWebhookPayload): Promise<void> {
  const webhookUrl = process.env.ARCHERBYTES_WEBHOOK_URL || process.env.ARCHERBYTES_WEBHOOK_BASE_URL
  const webhookSecret = process.env.WEBHOOK_SECRET

  if (!webhookUrl || !webhookSecret) {
    if (!warnedMissingArcherbytesConfig) {
      warnedMissingArcherbytesConfig = true
      console.warn(
        'Archerbytes webhook not configured. Set ARCHERBYTES_WEBHOOK_URL or ARCHERBYTES_WEBHOOK_BASE_URL, plus WEBHOOK_SECRET.',
      )
    }
    return
  }

  const url =
    webhookUrl.includes('/api/webhooks') && !webhookUrl.endsWith(payload.event)
      ? `${webhookUrl}/${payload.event}`
      : webhookUrl

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${webhookSecret}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error(`Archerbytes webhook failed: ${response.status} ${await response.text()}`)
      return
    }

    console.log(`Archerbytes webhook sent for ${payload.event}:${payload.action}`)
  } catch (error) {
    console.error('Error sending Archerbytes webhook:', error)
  }
}

export const afterChangeArcherbytesArticle: CollectionAfterChangeHook = async ({
  doc,
  operation,
}) => {
  const action: ArcherbytesWebhookAction = operation === 'create' ? 'created' : 'updated'
  const articleId =
    typeof doc?.slug === 'string' && doc.slug.length > 0 ? doc.slug : coerceIdToString(doc?.id)
  if (!articleId) return doc

  await sendArcherbytesWebhook({
    event: 'article',
    action,
    articleId,
    timestamp: new Date().toISOString(),
    cms: 'payload-cms',
  })

  return doc
}

export const afterDeleteArcherbytesArticle: CollectionAfterDeleteHook = async ({ doc }) => {
  const articleId =
    typeof doc?.slug === 'string' && doc.slug.length > 0 ? doc.slug : coerceIdToString(doc?.id)
  if (!articleId) return

  await sendArcherbytesWebhook({
    event: 'article',
    action: 'deleted',
    articleId,
    timestamp: new Date().toISOString(),
    cms: 'payload-cms',
  })
}

export const afterChangeArcherbytesCategory: CollectionAfterChangeHook = async ({
  doc,
  operation,
}) => {
  const action: ArcherbytesWebhookAction = operation === 'create' ? 'created' : 'updated'
  const categoryId = coerceIdToString(doc?.id)
  if (!categoryId) return doc

  await sendArcherbytesWebhook({
    event: 'category',
    action,
    categoryId,
    timestamp: new Date().toISOString(),
    cms: 'payload-cms',
  })

  return doc
}

export const afterDeleteArcherbytesCategory: CollectionAfterDeleteHook = async ({ doc }) => {
  const categoryId = coerceIdToString(doc?.id)
  if (!categoryId) return

  await sendArcherbytesWebhook({
    event: 'category',
    action: 'deleted',
    categoryId,
    timestamp: new Date().toISOString(),
    cms: 'payload-cms',
  })
}
