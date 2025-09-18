import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground flex-col">
      <div className="max-w-2xl mx-auto p-8 flex-1 flex justify-center flex-col">
        <section className="flex items-center gap-4 mb-8 justify-center">
          <picture>
            <source srcSet="/lscs-logo.png" />
            <Image alt="LSCS Logo" height={148} src="/lscs-logo.png" width={148} />
          </picture>
          <span>
            <h1 className="sm:text-5xl text-2xl font-bold text-foreground">LSCS CMS</h1>
            <h4 className="sm:text-sm text-xs font-extralight">40th La Salle Computer Society</h4>
          </span>
        </section>

        <div className="mb-6">
          {!user && (
            <h2 className="text-lg text-muted-foreground text-center">
              Welcome to your new project.
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
      </div>
      <footer className="text-sm font-extralight py-2 flex items-center">
        <picture>
          <source srcSet="https://avatars.githubusercontent.com/u/62968818?s=200&v=4" />
          <Image
            alt="LSCS Logo"
            height={16}
            src={'https://avatars.githubusercontent.com/u/62968818?s=200&v=4'}
            width={16}
          />
        </picture>
        Powered by Payload CMS
      </footer>
    </div>
  )
}
