import type { CollectionBeforeChangeHook } from 'payload'
import axios from 'axios'
import { logAxiosError } from '@/lib/utils'

// Core API committee codes. RND is the 40th-term code still held by existing members.
export const ADMIN_COMMITTEES = ['RND', 'TECH', 'SYS', 'SI', 'INFRA', 'DEV']
export const EDITOR_COMMITTEES = ['PUBLI', 'CORE', 'DI', 'PROD']

export const validateEmail: CollectionBeforeChangeHook = async ({ data, operation }) => {
  const email = data.email

  if (!email || typeof email !== 'string') {
    console.warn('validateEmail: missing or invalid email')
    return data
  }

  try {
    const coreUrl = process.env.LSCS_CORE_API_URL
    if (!coreUrl) {
      throw new Error('validateEmail: LSCS_CORE_API_URL is not configured')
    }

    const res = await axios.post(
      `${coreUrl}/member`,
      { email: email },
      {
        headers: { Authorization: `Bearer ${process.env.LSCS_CORE_API_TOKEN}` },
      },
    )

    const rawCommittee = res.data?.committee_id
    const committee = typeof rawCommittee === 'string' ? rawCommittee.toUpperCase() : undefined

    if (committee && EDITOR_COMMITTEES.includes(committee)) {
      data.role = 'editor'
      // mark user as belonging to the LSCS domain so access checks work immediately
      data.domain = 'lscs'
    } else if (committee && ADMIN_COMMITTEES.includes(committee)) {
      data.role = 'admin'
      data.domain = 'global'
    } else if (operation === 'create') {
      // Unrecognized committee: no access until an admin assigns a role in /admin/users.
      // Only on create, so saving an existing user never undoes a manual promotion.
      data.role = 'none'
    }

    return data
  } catch (err) {
    // Member not found (404) or Core API unavailable: never block the save.
    logAxiosError(err)
    console.error(
      'Failed to verify email with LSCS Core API: ' +
        (err as Error).message +
        '; proceeding without role changes',
    )
    if (operation === 'create') {
      data.role = 'none'
    }
    return data
  }
}
