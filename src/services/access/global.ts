import type { Access, FieldAccess } from 'payload'
import { UsersType } from '.'
import { UserRoles } from '.'

// Collection-level access functions
// Check if user is authenticated
export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

// Check if user is admin
export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user && (user as UsersType).role === 'admin')
}

// Check if user is admin or editor
export const isAdminOrEditor: Access = ({ req: { user } }) => {
  const userRole = (user as UsersType)?.role
  return Boolean(user && (userRole === 'admin' || userRole === 'editor'))
}

// Check if user is admin, editor, or viewer (any authenticated user)
export const hasRole: Access = ({ req: { user } }) => {
  const userRole = (user as UsersType)?.role
  return Boolean(user && UserRoles.includes(userRole))
}

// Check if user owns the document or is admin
export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (!user) return false

  const userRole = (user as UsersType)?.role

  // Admin can access everything
  if (userRole === 'admin') return true

  // Users can only access their own records
  return user.id === id
}

// Check if user is admin or owns the uploaded file (for media)
export const isAdminOrOwner: Access = ({ req: { user }, data }) => {
  if (!user) return false

  const userRole = (user as UsersType)?.role

  // Admin can access everything
  if (userRole === 'admin') return true

  // Check if user uploaded this file (media files have an uploadedBy field)
  return data?.uploadedBy === user.id
}

// Public read access
export const isPublic: Access = () => true

// Field-level access functions
export const isAdminField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user && (user as UsersType).role === 'admin')
}

export const isAdminOrEditorField: FieldAccess = ({ req: { user } }) => {
  const userRole = (user as UsersType)?.role
  return Boolean(user && (userRole === 'admin' || userRole === 'editor'))
}

export const isAuthenticatedField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user)
}
