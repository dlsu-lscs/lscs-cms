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
      console.warn('validateEmail: LSCS_CORE_API_URL is not configured')
      return data
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
    logAxiosError(err)
  }

  return data
}
