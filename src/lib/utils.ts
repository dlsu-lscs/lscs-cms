import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function logAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error(`[${error.response.status}]`, error.message)
    } else if (error.request) {
      console.error('No response:', error.request)
    } else {
      console.error('Axios config error:', error.message)
    }
  } else {
    console.error('Unknown error:', error)
  }
}
