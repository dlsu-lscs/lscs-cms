import type { Access, FieldAccess } from 'payload'
import { UsersType } from '.'
import { UserRoles } from '.'

const localDomain = ['lscs', 'global']

// Field-level access functions

export const lscsIsAdminOrEditorField: FieldAccess = ({ req: { user } }) => {
  const userRole = (user as UsersType)?.role
  return Boolean(
    user &&
      (userRole === 'admin' || userRole === 'editor') &&
      localDomain.includes((user as UsersType).domain),
  )
}

export const lscsIsAuthenticatedField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user && localDomain.includes((user as UsersType).domain))
}

// collections access

export const lscsHasRole: Access = ({ req: { user } }) => {
  const userRole = (user as UsersType)?.role
  return Boolean(
    user && UserRoles.includes(userRole) && localDomain.includes((user as UsersType).domain),
  )
}

export const isAdminOrLscsEditor: Access = ({ req: { user } }) => {
  const userRole = (user as UsersType)?.role
  return Boolean(
    user &&
      (userRole === 'admin' || userRole === 'editor') &&
      localDomain.includes((user as UsersType).domain),
  )
}

export const isAdminOrLscsSelf: Access = ({ req: { user }, id }) => {
  if (!user) return false

  const userRole = (user as UsersType)?.role

  // Admin can access everything
  if (userRole === 'admin') return true

  // Users can only access their own records
  return user.id === id && localDomain.includes((user as UsersType).domain)
}
