'use client'
import React from 'react'
import { adminAuthClient } from '@/lib/auth'
import { FcGoogle } from 'react-icons/fc'

export default function GoogleLogin() {
  const { oauth } = adminAuthClient.signin()

  const handleGoogleSignin = async () => {
    oauth('google')
  }

  return (
    <div className="oauth-container flex items-center flex-col gap-4">
      <h4>Or sign in with</h4>
      <button
        type="button"
        onClick={handleGoogleSignin}
        className="flex items-center justify-center text-lg text-white font-bold gap-2 border-none py-2 px-6 cursor-pointer rounded-lg"
      >
        <FcGoogle /> Google
      </button>
    </div>
  )
}
