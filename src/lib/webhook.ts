import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

type WebhookAction = 'created' | 'updated' | 'deleted'

type WebhookImageType = 'hero' | 'about-section' | 'what-we-do-section' | 'who-we-are-section'

type WebhookPayload =
  | {
      event: 'article'
      action: WebhookAction
      articleId: string
      timestamp: string
      cms?: string
    }
  | {
      event: 'category'
      action: WebhookAction
      categoryId: string
      timestamp: string
      cms?: string
    }
  | {
      event: 'partner'
      action: WebhookAction
      partnerId: string
      timestamp: string
      cms?: string
    }
  | {
      event: 'award'
      action: WebhookAction
      awardId: string
      timestamp: string
      cms?: string
    }
  | {
      event: 'image'
      action: WebhookAction
      imageType: WebhookImageType
      timestamp: string
      cms?: string
    }

const WEBHOOK_EVENT_PATH: Record<WebhookPayload['event'], string> = {
  article: 'articles',
  category: 'categories',
  partner: 'partners',
  award: 'awards',
  image: 'images',
}

let warnedMissingWebhookConfig = false

function resolveWebhookUrl(event: WebhookPayload['event']): string | undefined {
  const baseUrl = process.env.WEBHOOK_BASE_URL
  const fullUrl = process.env.WEBHOOK_URL
  const legacyUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL

  if (fullUrl) return fullUrl

  if (baseUrl) {
    return `${baseUrl.replace(/\/+$/, '')}/api/webhooks/${WEBHOOK_EVENT_PATH[event]}`
  }

  if (!legacyUrl) return undefined

  // Back-compat: try to derive the event endpoint from a legacy URL.
  // If the legacy URL already targets /api/webhooks/<type>, we replace <type>.
  // If it targets /api/webhooks, we append <type>.
  try {
    const url = new URL(legacyUrl)
    const marker = '/api/webhooks'
    const idx = url.pathname.indexOf(marker)

    if (idx === -1) {
      // Can't safely derive other endpoints; treat as-is (typically articles-only).
      return event === 'article' ? legacyUrl : undefined
    }

    const prefix = url.pathname.slice(0, idx + marker.length)
    url.pathname = `${prefix}/${WEBHOOK_EVENT_PATH[event]}`
    return url.toString()
  } catch {
    return event === 'article' ? legacyUrl : undefined
  }
}

function getVerboseLoggingEnabled(): boolean {
  return process.env.WEBHOOK_VERBOSE_LOGGING === 'true'
}

async function sendWebhook(payload: WebhookPayload): Promise<void> {
  const webhookUrl = resolveWebhookUrl(payload.event)
  const webhookSecret = process.env.WEBHOOK_SECRET

  // Skip webhook if not configured
  if (!webhookUrl || !webhookSecret) {
    if (!warnedMissingWebhookConfig) {
      warnedMissingWebhookConfig = true
      console.warn(
        'Webhook not configured. Set WEBHOOK_BASE_URL (recommended) or WEBHOOK_URL/NEXT_PUBLIC_WEBHOOK_URL, plus WEBHOOK_SECRET.',
      )
    }
    return
  }

  try {
    if (getVerboseLoggingEnabled()) {
      console.log('Sending webhook:', { webhookUrl, payload })
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${webhookSecret}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Webhook request failed with status ${response.status}: ${errorText}`)
      return
    }

    const result = await response.json()
    console.log(`Webhook sent successfully for ${payload.event}:${payload.action} event:`, result)
  } catch (error) {
    console.error('Error sending webhook:', error)
    // Don't throw - we don't want webhook failures to break article operations
  }
}

function coerceIdToString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'bigint') return String(value)

  if (typeof value === 'object' && value !== null && 'id' in value) {
    const rel = value as { id?: unknown }
    return coerceIdToString(rel.id)
  }

  return undefined
}

export const afterChangeArticle: CollectionAfterChangeHook = async ({ doc, operation }) => {
  // Determine if this is a create or update based on the operation
  const action: WebhookAction = operation === 'create' ? 'created' : 'updated'

  const articleId =
    typeof doc?.slug === 'string' && doc.slug.length > 0 ? doc.slug : coerceIdToString(doc?.id)
  if (!articleId) return doc

  await sendWebhook({
    event: 'article',
    action,
    articleId,
    timestamp: new Date().toISOString(),
    cms: 'payload-cms',
  })
  return doc
}

export const afterDeleteArticle: CollectionAfterDeleteHook = async ({ doc }) => {
  const articleId =
    typeof doc?.slug === 'string' && doc.slug.length > 0 ? doc.slug : coerceIdToString(doc?.id)
  if (!articleId) return

  await sendWebhook({
    event: 'article',
    action: 'deleted',
    articleId,
    timestamp: new Date().toISOString(),
    cms: 'payload-cms',
  })
}

export const afterChangePartner: CollectionAfterChangeHook = async ({ doc, operation }) => {
  const action: WebhookAction = operation === 'create' ? 'created' : 'updated'

  const partnerId = coerceIdToString(doc?.id)
  if (!partnerId) return doc

  await sendWebhook({
    event: 'partner',
    action,
    partnerId,
    timestamp: new Date().toISOString(),
    cms: 'payload-cms',
  })

  return doc
}

export const afterDeletePartner: CollectionAfterDeleteHook = async ({ doc }) => {
  const partnerId = coerceIdToString(doc?.id)
  if (!partnerId) return

  await sendWebhook({
    event: 'partner',
    action: 'deleted',
    partnerId,
    timestamp: new Date().toISOString(),
    cms: 'payload-cms',
  })
}

export const afterChangeAward: CollectionAfterChangeHook = async ({ doc, operation }) => {
  const action: WebhookAction = operation === 'create' ? 'created' : 'updated'

  const awardId = coerceIdToString(doc?.id)
  if (!awardId) return doc

  await sendWebhook({
    event: 'award',
    action,
    awardId,
    timestamp: new Date().toISOString(),
    cms: 'payload-cms',
  })

  return doc
}

export const afterDeleteAward: CollectionAfterDeleteHook = async ({ doc }) => {
  const awardId = coerceIdToString(doc?.id)
  if (!awardId) return

  await sendWebhook({
    event: 'award',
    action: 'deleted',
    awardId,
    timestamp: new Date().toISOString(),
    cms: 'payload-cms',
  })
}

export const afterChangeCategory: CollectionAfterChangeHook = async ({ doc, operation }) => {
  const action: WebhookAction = operation === 'create' ? 'created' : 'updated'

  const categoryId = coerceIdToString(doc?.id)
  if (!categoryId) return doc

  await sendWebhook({
    event: 'category',
    action,
    categoryId,
    timestamp: new Date().toISOString(),
    cms: 'payload-cms',
  })

  return doc
}

export const afterDeleteCategory: CollectionAfterDeleteHook = async ({ doc }) => {
  const categoryId = coerceIdToString(doc?.id)
  if (!categoryId) return

  await sendWebhook({
    event: 'category',
    action: 'deleted',
    categoryId,
    timestamp: new Date().toISOString(),
    cms: 'payload-cms',
  })
}

function getRelId(value: unknown): string | undefined {
  return coerceIdToString(value)
}

function arrayIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return undefined
      const imageVal = (entry as { image?: unknown }).image
      return getRelId(imageVal)
    })
    .filter((id): id is string => Boolean(id))
}

function idsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false
  }
  return true
}

function getChangedImageTypes(doc: any, previousDoc: any, operation: string): WebhookImageType[] {
  if (operation === 'create' || !previousDoc) {
    // On create, treat any populated section as "changed".
    const changed: WebhookImageType[] = []

    if (getRelId(doc?.hero?.image)) changed.push('hero')
    if (getRelId(doc?.whoAreWe?.image)) changed.push('who-we-are-section')

    const whatWeDoIds = [
      doc?.whatWeDo?.image1,
      doc?.whatWeDo?.image2,
      doc?.whatWeDo?.image3,
      doc?.whatWeDo?.image4,
    ]
      .map(getRelId)
      .filter((id): id is string => Boolean(id))
    if (whatWeDoIds.length > 0) changed.push('what-we-do-section')

    const aboutIds = arrayIds(doc?.about?.images)
    if (aboutIds.length > 0) changed.push('about-section')

    return changed
  }

  const changed: Set<WebhookImageType> = new Set()

  if (getRelId(doc?.hero?.image) !== getRelId(previousDoc?.hero?.image)) {
    changed.add('hero')
  }

  if (getRelId(doc?.whoAreWe?.image) !== getRelId(previousDoc?.whoAreWe?.image)) {
    changed.add('who-we-are-section')
  }

  const currWhatWeDo = [
    doc?.whatWeDo?.image1,
    doc?.whatWeDo?.image2,
    doc?.whatWeDo?.image3,
    doc?.whatWeDo?.image4,
  ]
    .map(getRelId)
    .filter((id): id is string => Boolean(id))
  const prevWhatWeDo = [
    previousDoc?.whatWeDo?.image1,
    previousDoc?.whatWeDo?.image2,
    previousDoc?.whatWeDo?.image3,
    previousDoc?.whatWeDo?.image4,
  ]
    .map(getRelId)
    .filter((id): id is string => Boolean(id))

  if (!idsEqual(currWhatWeDo, prevWhatWeDo)) {
    changed.add('what-we-do-section')
  }

  const currAbout = arrayIds(doc?.about?.images)
  const prevAbout = arrayIds(previousDoc?.about?.images)
  if (!idsEqual(currAbout, prevAbout)) {
    changed.add('about-section')
  }

  return Array.from(changed)
}

export const afterChangeWebAssets: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  const action: WebhookAction = operation === 'create' ? 'created' : 'updated'
  const changedImageTypes = getChangedImageTypes(doc, previousDoc, operation)

  if (getVerboseLoggingEnabled()) {
    console.log('afterChangeWebAssets:', {
      operation,
      action,
      changedImageTypes,
    })
  }

  await Promise.all(
    changedImageTypes.map((imageType) =>
      sendWebhook({
        event: 'image',
        action,
        imageType,
        timestamp: new Date().toISOString(),
        cms: 'payload-cms',
      }),
    ),
  )

  return doc
}

export const afterDeleteWebAssets: CollectionAfterDeleteHook = async () => {
  const timestamp = new Date().toISOString()
  await Promise.all(
    (['hero', 'about-section', 'what-we-do-section', 'who-we-are-section'] as const).map(
      (imageType) =>
        sendWebhook({
          event: 'image',
          action: 'deleted',
          imageType,
          timestamp,
          cms: 'payload-cms',
        }),
    ),
  )
}
