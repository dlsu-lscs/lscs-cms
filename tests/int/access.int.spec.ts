import type { SanitizedConfig } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { isAdminOrAccountOwner } from '@/services/access'

type AccessArgs = Parameters<NonNullable<SanitizedConfig['collections'][number]['access']['read']>>[0]

const admin = { id: 1, email: 'admin@dlsu.edu.ph', role: 'admin', domain: 'global' }
const editor = { id: 2, email: 'editor@dlsu.edu.ph', role: 'editor', domain: 'lscs' }
const noRole = { id: 3, email: 'someone@gmail.com', role: 'none', domain: 'global' }

const asReq = (user: unknown, extra: Record<string, unknown> = {}) =>
  ({ req: { user }, ...extra }) as unknown as AccessArgs

let built: SanitizedConfig

const getCollection = (slug: string) => {
  const collection = built.collections.find((c) => c.slug === slug)
  if (!collection) throw new Error(`collection ${slug} not found`)
  return collection
}

const getField = (collectionSlug: string, fieldName: string) => {
  const field = getCollection(collectionSlug).fields.find(
    (f) => 'name' in f && f.name === fieldName,
  )
  if (!field) throw new Error(`field ${fieldName} not found`)
  return field
}

beforeAll(async () => {
  built = await config
})

describe('apiKeys collection (injected by payload-auth-plugin)', () => {
  const operations = ['read', 'create', 'update', 'delete'] as const

  it.each(operations)('denies %s to anonymous and non-admin users', async (op) => {
    const access = getCollection('apiKeys').access[op]
    for (const user of [null, editor, noRole]) {
      expect(await access(asReq(user))).toBe(false)
    }
  })

  it.each(operations)('allows %s to admins', async (op) => {
    expect(await getCollection('apiKeys').access[op](asReq(admin))).toBe(true)
  })
})

describe('accounts collection', () => {
  it('denies delete to anonymous and non-admin users', async () => {
    const access = getCollection('accounts').access.delete
    for (const user of [null, editor, noRole]) {
      expect(await access(asReq(user))).toBe(false)
    }
    expect(await access(asReq(admin))).toBe(true)
  })

  it('keeps create and update closed to everyone but the plugin', async () => {
    const { create, update } = getCollection('accounts').access
    for (const user of [null, editor, admin]) {
      expect(await create(asReq(user))).toBe(false)
      expect(await update(asReq(user))).toBe(false)
    }
  })

  it('scopes reads to the linked user, not the account id', async () => {
    expect(getCollection('accounts').access.read).toBe(isAdminOrAccountOwner)
    expect(await isAdminOrAccountOwner(asReq(null, { id: 3 }))).toBe(false)
    expect(await isAdminOrAccountOwner(asReq(admin))).toBe(true)
    // Matching ids must not grant access to someone else's account record
    expect(await isAdminOrAccountOwner(asReq(noRole, { id: noRole.id }))).toEqual({
      user: { equals: noRole.id },
    })
  })
})

describe('users collection', () => {
  it('only lets admins create users through the API', async () => {
    const access = getCollection('users').access.create
    for (const user of [null, editor, noRole]) {
      expect(await access(asReq(user))).toBe(false)
    }
    expect(await access(asReq(admin))).toBe(true)
  })

  it.each(['role', 'domain'])('only lets admins set %s on create or update', async (name) => {
    const field = getField('users', name)
    const fieldAccess = 'access' in field ? field.access : undefined
    for (const op of ['create', 'update'] as const) {
      const check = fieldAccess?.[op]
      expect(check, `${name}.access.${op}`).toBeTypeOf('function')
      for (const user of [null, editor, noRole]) {
        expect(await check!({ req: { user } } as never)).toBe(false)
      }
      expect(await check!({ req: { user: admin } } as never)).toBe(true)
    }
  })
})
