import { adminAuthClient } from '@/lib/auth'
import { useEffect, useState } from 'react'

export const useSession = () => {
  const [loading, setLoading] = useState<boolean>()
  const [session, setSession] = useState<{
    data: any
    message: string
    isSuccess: boolean
  }>({
    data: {},
    message: '',
    isSuccess: false,
  })

  useEffect(() => {
    setLoading(true)
    const fetchSession = async () => {
      try {
        const { data, isSuccess, message } = await adminAuthClient.getClientSession()
        console.log('Session response:', { isSuccess, message, data })

        setSession({
          data: data || {},
          message,
          isSuccess,
        })
      } catch (error) {
        console.error('Error fetching session:', error)
        setSession({
          data: {},
          message: 'Failed to fetch session',
          isSuccess: false,
        })
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [])

  return {
    loading,
    ...session,
  }
}
