'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role?: string
}

export default function UnauthorizedBanner() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/me', {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const userData = await response.json()
          // console.log('User data from API:', userData)
          setUser(userData.user || userData)
        } else {
          const errorData = await response.text()
          // console.error('API Error:', response.status, errorData)
          setError(`Failed to fetch user data: ${response.status}`)
        }
      } catch (err) {
        // console.error('Fetch error:', err)
        setError('Network error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (user?.role !== 'none') return null

  if (loading) {
    return (
      <div className="bg-gray-100 text-gray-600 p-4 rounded mb-6 border border-gray-300">
        Loading user information...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded mb-6 border border-red-300">
        ❌ Error: {error}
        <details className="mt-2">
          <summary className="text-xs cursor-pointer">Debug Info</summary>
          <p className="text-xs mt-1">Check browser console for more details</p>
        </details>
      </div>
    )
  }

  return (
    <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-6 border border-yellow-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">⚠️ Unauthorized Access</p>
          <p className="text-sm mt-1">
            {user ? (
              <>
                Welcome, {user.firstName || user.email}! Your account does not have a role assigned.
                Please contact the administrator.
              </>
            ) : (
              'Your account does not have a role assigned. Please contact the administrator.'
            )}
          </p>
          {/* {user && (
            <div className="text-xs mt-2 opacity-75">
              <p>Email: {user.email}</p>
              <p>Role: {user.role || 'Not assigned'}</p>
              <p>User ID: {user.id}</p>
            </div>
          )} */}
          {/* Debug info
          <details className="mt-2">
            <summary className="text-xs cursor-pointer">Debug Info</summary>
            <pre className="text-xs mt-1 bg-yellow-50 p-2 rounded">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details> */}
        </div>
      </div>
    </div>
  )
}
