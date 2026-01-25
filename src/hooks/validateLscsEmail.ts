import type { CollectionBeforeChangeHook } from 'payload'
import axios from 'axios'
import { logAxiosError } from '@/lib/utils'

export const validateEmail: CollectionBeforeChangeHook = async ({ data }) => {
  const email = data.email

  if (!email || typeof email !== 'string') {
    console.warn('validateEmail: missing or invalid email')
    return data
  }

  try {
    const coreUrl = process.env.LSCS_CORE_API_URL
    if (!coreUrl) {
      // Fail fast: if the core API URL is not configured we cannot verify domain/role
      // and should prevent creation to avoid unknown/incorrect user records.
      throw new Error('validateEmail: LSCS_CORE_API_URL is not configured')
    }

    const res = await axios.post(
      `${coreUrl}/member`,
      { email: email },
      {
        headers: { Authorization: `Bearer ${process.env.LSCS_CORE_API_TOKEN}` },
      },
    )

    const committee = res.data.committee_id
    if (committee === 'PUBLI' || committee === 'CORE') {
      data.role = 'editor'
      // mark user as belonging to the LSCS domain so access checks work immediately
      data.domain = 'lscs'
    } else if (committee === 'RND') {
      data.role = 'admin'
      data.domain = 'global'
    }

    return data
  } catch (err) {
    // If the core API explicitly returns 404 (member not found), allow creation to proceed
    // without setting role/domain. This prevents blocking signups for non-members.

    // Log other axios errors for diagnostics, then rethrow to stop the create/update.
    logAxiosError(err)
    // Rethrow a clear error for Payload to present to the caller.
    console.error(
      'Failed to verify email with LSCS Core API: ' +
        (err as Error).message +
        '; proceeding without changes',
    )
    return data
  }
}
