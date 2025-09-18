import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf, isAuthenticated, isAdminField } from '@/services/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: { useAPIKey: true, useSessions: true },
  access: {
    // Only authenticated users can read user data
    read: isAuthenticated,
    // Only admins can create new users
    create: isAdmin,
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
      defaultValue: 'viewer',
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
      ],
      access: {
        // Only admins can change roles
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
}
