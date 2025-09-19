// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { SGAR_Units } from './collections/sgar/SGAR-Units'
import { SGAR_Exec_Board } from './collections/sgar/SGAR-Exec-Board'
import { SGAR_Media } from './collections/sgar/SGAR-Media'
import { SGAR_Positions } from './collections/sgar/SGAR-Positions'
import { SGAR_Committees } from './collections/sgar/SGAR-Committees'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    theme: 'dark',
    user: Users.slug,
    meta: {
      titleSuffix: '- LSCS CMS',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/lscs-logo.png',
        },
      ],
    },
    components: {
      graphics: {
        Logo: '/components/AdminLogo',
        Icon: '/components/AdminIcon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Posts,
    SGAR_Units,
    SGAR_Exec_Board,
    SGAR_Media,
    SGAR_Positions,
    SGAR_Committees,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
