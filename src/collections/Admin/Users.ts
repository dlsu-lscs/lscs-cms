import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf, isAdminField, isAuthenticated } from '@/services/access'
import { deleteLinkedAccounts } from 'payload-auth-plugin/collection/hooks'
import { AdminAccounts } from './Accounts'
import { validateEmail } from '@/hooks/validateLscsEmail'

export const AdminUsers: CollectionConfig = {
  slug: 'users',
  admin: {
    defaultColumns: ['firstName', 'email'],
    useAsTitle: 'email',
    group: 'Admin',
  },
  auth: { useAPIKey: true, useSessions: true },
  access: {
    // Only authenticated users can read user data
    read: isAdminOrSelf,

    create: isAuthenticated,
    // Users can update their own profile, admins can update anyone
    update: isAdminOrSelf,
    // Only admins can delete users
    delete: isAdmin,
  },
  fields: [
    // Email added by default
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'none',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Viewer',
          value: 'viewer',
        },
        {
          label: 'None',
          value: 'none',
        },
      ],
      access: {
        // Only admins can change roles
        update: isAdminField,
      },
    },
    {
      name: 'domain',
      type: 'select',
      defaultValue: 'global',
      options: [
        {
          label: 'LSCS',
          value: 'lscs',
        },
        {
          label: 'Global',
          value: 'global',
        },
      ],
      required: true,
      access: {
        update: isAdminField,
      },
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
  ],
  timestamps: true,
  hooks: {
    afterDelete: [deleteLinkedAccounts(AdminAccounts.slug)],
    beforeChange: [validateEmail],
  },
}
