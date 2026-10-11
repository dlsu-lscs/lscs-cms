import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Logs request metadata only; headers and response bodies are omitted
// because they carry the Core API token and member data.
export function logAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const request = {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
    }

    if (error.response) {
      console.error('[core-api] request failed', { ...request, status: error.response.status })
    } else if (error.request) {
      console.error('[core-api] no response received', { ...request, code: error.code })
    } else {
      console.error('[core-api] request setup failed', { ...request, message: error.message })
    }
  } else {
    console.error('[core-api] unexpected error', error)
  }
}
