import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground flex-col">
      <div className="max-w-2xl mx-auto p-8 flex-1 flex justify-center flex-col">
        <section className="flex flex-col items-center gap-4 mb-8 justify-center">
          <div className="flex items-center gap-4 justify-center">
            <picture>
              <source srcSet="/lscs-logo.png" />
              <Image alt="LSCS Logo" height={148} src="/lscs-logo.png" width={148} />
            </picture>
            <span>
              <h1 className="sm:text-5xl text-2xl font-bold text-foreground">LSCS CMS</h1>
              <h4 className="sm:text-sm text-xs font-extralight">40th La Salle Computer Society</h4>
            </span>
          </div>

          <h3 className="text-lg text-center text-muted-foreground leading-relaxed">
            A headless Content Management System managed by La Salle Computer Society.
          </h3>
        </section>

        <div className="mb-4">
          {!user && (
            <h2 className="text-sm text-muted-foreground text-center">
              Sign in to access the admin panel.
            </h2>
          )}
          {user && (
            <h2 className="text-lg text-center text-foreground">Welcome back, {user.email}</h2>
          )}
        </div>

        <div className="flex gap-4 flex-col sm:flex-row justify-center">
          <Button className="">
            <a href={payloadConfig.routes.admin} rel="noopener noreferrer" target="_blank">
              Go to admin panel
            </a>
          </Button>

          <Button variant={'outline'}>
            <a href="https://payloadcms.com/docs" rel="noopener noreferrer" target="_blank">
              Documentation
            </a>
          </Button>
        </div>

        <section className="w-full max-w-xl mx-auto mt-6">
          <details className="w-full">
            <summary className="cursor-pointer text-sm text-muted-foreground text-center hover:text-foreground transition">
              Learn more about LSCS CMS
            </summary>
            <div className="mt-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-muted-foreground leading-relaxed">
              LSCS CMS is a headless Content Management System designed for the La Salle Computer
              Society (LSCS). It provides a secure platform for authorized members to manage and
              publish articles, announcements, web assets, and content related to LSCS and external
              activities and events.
            </div>
          </details>
        </section>
      </div>
      <footer className="text-sm font-extralight py-2 flex items-center justify-center">
        Powered by Payload CMS
        <picture className="ml-1">
          <source srcSet="https://avatars.githubusercontent.com/u/62968818?s=200&v=4" />
          <Image
            alt="LSCS Logo"
            height={16}
            src={'https://avatars.githubusercontent.com/u/62968818?s=200&v=4'}
            width={16}
          />
        </picture>
        {'   |  '}
        <Link
          href="/privacy-policy"
          className="inline-block text-sm ml-1 hover:text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </Link>
      </footer>
    </div>
  )
}
