import Link from 'next/link'
import React from 'react'

export default function PrivacyPolicyDashboardLink() {
  return (
    <div className="mt-6 text-center">
      <Link
        href="/privacy-policy"
        className="inline-block px-4 py-2 text-sm text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </Link>
    </div>
  )
}
