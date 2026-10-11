import { Plugin } from 'payload'
import { AdminUsers } from '@/collections/Admin/Users'
import { s3Storage } from '@payloadcms/storage-s3'
import { authPlugin } from 'payload-auth-plugin'
import { GoogleAuthProvider } from 'payload-auth-plugin/providers'
import { AdminAccounts } from '@/collections/Admin/Accounts'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { GenerateTitle } from '@payloadcms/plugin-seo/types'
import { isAdmin } from '@/services/access'

const generateTitle: GenerateTitle = ({ doc, ...args }) => {
  const collection = args.collectionConfig?.slug ?? ''
  if (collection === 'lscs-articles')
    return doc.title ? `${doc.title} | LSCS Articles` : 'LSCS Articles'

  return 'La Salle Computer Society'
}

// payload-auth-plugin always injects an `apiKeys` collection with fully public access.
// Restrict it to admins; must run after authPlugin.
export const lockAuthPluginCollections: Plugin = (config) => ({
  ...config,
  collections: config.collections?.map((collection) =>
    collection.slug === 'apiKeys'
      ? {
          ...collection,
          admin: { ...collection.admin, group: 'Admin' },
          access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
        }
      : collection,
  ),
})

export const plugins: Plugin[] = [
  payloadCloudPlugin(),
  authPlugin({
    name: 'admin',
    useAdmin: true,
    allowOAuthAutoSignUp: true,
    usersCollectionSlug: AdminUsers.slug,
    accountsCollectionSlug: AdminAccounts.slug,
    successRedirectPath: '/admin',
    errorRedirectPath: '/admin/login',
    providers: [
      GoogleAuthProvider({
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
    ],
  }),
  lockAuthPluginCollections,
  s3Storage({
    collections: {
      media: true,
    },
    bucket: process.env.S3_BUCKET!,
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: true,
      region: process.env.S3_REGION!,
      // ... Other S3 configuration
    },
  }),
  seoPlugin({ generateTitle }),
]
