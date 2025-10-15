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
    const res = await axios.post(
      `${process.env.LSCS_CORE_API_URL}/member` || '',
      { email: email },
      { headers: { Authorization: `Bearer ${process.env.LSCS_CORE_API_TOKEN}` } },
    )

    const committee = res.data.committee_id
    if (committee === 'PUBLI' || committee === 'CORE') {
      data.role = 'editor'
    } else if (committee === 'RND') {
      data.role = 'admin'
    }

    return data
  } catch (err) {
    logAxiosError(err)
  }

  return data
}
