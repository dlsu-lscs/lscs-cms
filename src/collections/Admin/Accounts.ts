import { isAdmin, isAdminOrAccountOwner } from '@/services/access'
import { withAccountCollection } from 'payload-auth-plugin/collection'
export const AdminAccounts = withAccountCollection(
  {
    slug: 'accounts',
    admin: {
      group: 'Admin',
    },
    access: {
      read: isAdminOrAccountOwner,
      // Plugin default is public delete; unlinking an account locks the user out of OAuth
      delete: isAdmin,
    },
  },
  'users',
)
