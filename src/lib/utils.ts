import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function logAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // suppressed detailed axios response logging
    } else if (error.request) {
      // suppressed no-response logging
    } else {
      // suppressed axios config error logging
    }
  } else {
    // suppressed unknown error logging
  }
}
