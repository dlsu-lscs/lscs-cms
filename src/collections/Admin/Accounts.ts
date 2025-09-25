import { isAdminOrSelf } from '@/services/access'
import { withAccountCollection } from 'payload-auth-plugin/collection'
export const AdminAccounts = withAccountCollection(
  {
    slug: 'accounts',
    admin: {
      group: 'Admin',
    },
    access: {
      read: isAdminOrSelf,
    },
  },
  'users',
)
