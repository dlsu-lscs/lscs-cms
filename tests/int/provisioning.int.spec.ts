import axios, { AxiosError, AxiosHeaders } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { validateEmail } from '@/hooks/validateLscsEmail'
import { logAxiosError } from '@/lib/utils'

type HookArgs = Parameters<typeof validateEmail>[0]

const runHook = (data: Record<string, unknown>, operation: 'create' | 'update') =>
  validateEmail({ data, operation } as unknown as HookArgs) as Promise<Record<string, unknown>>

const coreReturns = (committee_id: unknown) =>
  vi.spyOn(axios, 'post').mockResolvedValue({ data: { committee_id } })

const axiosError = (status?: number) => {
  const config = { method: 'post', url: 'https://core.example/member', headers: new AxiosHeaders() }
  const response = status
    ? { status, statusText: '', headers: {}, config, data: { email: 'member@dlsu.edu.ph' } }
    : undefined
  return new AxiosError('request failed', 'ERR_BAD_RESPONSE', config, {}, response)
}

beforeEach(() => {
  vi.stubEnv('LSCS_CORE_API_URL', 'https://core.example')
  vi.stubEnv('LSCS_CORE_API_TOKEN', 'secret-token')
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('validateEmail committee mapping', () => {
  it.each(['RND', 'TECH', 'SYS', 'SI', 'INFRA', 'DEV'])('maps %s to global admin', async (code) => {
    coreReturns(code)
    expect(await runHook({ email: 'a@dlsu.edu.ph' }, 'create')).toMatchObject({
      role: 'admin',
      domain: 'global',
    })
  })

  it.each(['PUBLI', 'CORE', 'DI', 'PROD'])('maps %s to LSCS editor', async (code) => {
    coreReturns(code)
    expect(await runHook({ email: 'a@dlsu.edu.ph' }, 'create')).toMatchObject({
      role: 'editor',
      domain: 'lscs',
    })
  })

  it('normalizes committee case', async () => {
    coreReturns('tech')
    expect(await runHook({ email: 'a@dlsu.edu.ph' }, 'create')).toMatchObject({ role: 'admin' })
  })

  it.each([null, undefined, 'HR', 42])('defaults %s to role none on create', async (code) => {
    coreReturns(code)
    expect(await runHook({ email: 'a@dlsu.edu.ph', role: 'editor' }, 'create')).toMatchObject({
      role: 'none',
    })
  })

  it('keeps a manually assigned role on update when the committee is unrecognized', async () => {
    coreReturns(null)
    expect(await runHook({ email: 'a@dlsu.edu.ph', role: 'editor' }, 'update')).toMatchObject({
      role: 'editor',
    })
  })

  it('does not block creation when the Core API errors', async () => {
    vi.spyOn(axios, 'post').mockRejectedValue(axiosError(404))
    expect(await runHook({ email: 'a@dlsu.edu.ph', role: 'admin' }, 'create')).toMatchObject({
      role: 'none',
    })
  })

  it('keeps the existing role on update when the Core API errors', async () => {
    vi.spyOn(axios, 'post').mockRejectedValue(axiosError(503))
    expect(await runHook({ email: 'a@dlsu.edu.ph', role: 'admin' }, 'update')).toMatchObject({
      role: 'admin',
    })
  })
})

describe('logAxiosError', () => {
  it('logs status and request target for HTTP errors without leaking secrets', () => {
    logAxiosError(axiosError(401))
    expect(console.error).toHaveBeenCalledWith('[core-api] request failed', {
      method: 'POST',
      url: 'https://core.example/member',
      status: 401,
    })
    const logged = JSON.stringify(vi.mocked(console.error).mock.calls)
    expect(logged).not.toContain('secret-token')
    expect(logged).not.toContain('member@dlsu.edu.ph')
  })

  it('logs network failures with the error code', () => {
    logAxiosError(axiosError())
    expect(console.error).toHaveBeenCalledWith('[core-api] no response received', {
      method: 'POST',
      url: 'https://core.example/member',
      code: 'ERR_BAD_RESPONSE',
    })
  })

  it('logs non-axios errors', () => {
    const error = new Error('boom')
    logAxiosError(error)
    expect(console.error).toHaveBeenCalledWith('[core-api] unexpected error', error)
  })
})
