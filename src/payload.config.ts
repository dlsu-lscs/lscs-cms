// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { AdminUsers } from './collections/Admin/Users'
import { Media } from './collections/Media'
import { SGAR_Units } from './collections/sgar/SGAR-Units'
import { SGAR_Clusters } from './collections/sgar/SGAR-Cluster'
import { LSCS_Article_Category } from './collections/lscs/LSCS-Article-Category'
import { LSCS_Articles } from './collections/lscs/LSCS-Articles'
import { LSCS_Article_Authors } from './collections/lscs/LSCS-Article-Authors'
import { Archerbytes_Article_Category } from './collections/archerbytes/Archerbytes-Article-Category'
import { Archerbytes_Articles } from './collections/archerbytes/Archerbytes-Articles'
import { plugins } from './plugins'
import { AdminAccounts } from './collections/Admin/Accounts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    theme: 'dark',
    user: AdminUsers.slug,
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
        Logo: '@/components/admin/atoms/AdminLogo',
        Icon: '@/components/admin/atoms/AdminIcon',
      },
      afterLogin: ['@/components/admin/atoms/GoogleLogin'],
      beforeDashboard: ['@/components/admin/molecules/UnauthorizedBanner'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  collections: [
    AdminUsers,
    AdminAccounts,
    Media,
    LSCS_Article_Category,
    LSCS_Articles,
    LSCS_Article_Authors,
    Archerbytes_Article_Category,
    Archerbytes_Articles,
    SGAR_Units,
    SGAR_Clusters,
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
    ...plugins,
    // storage-adapter-placeholder
  ],
})
