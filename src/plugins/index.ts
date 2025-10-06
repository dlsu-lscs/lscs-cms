import { Plugin } from 'payload'
import { AdminUsers } from '@/collections/Admin/Users'
import { s3Storage } from '@payloadcms/storage-s3'
import { authPlugin } from 'payload-auth-plugin'
import { GoogleAuthProvider } from 'payload-auth-plugin/providers'
import { AdminAccounts } from '@/collections/Admin/Accounts'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'

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

]
