import type { Access, FieldAccess } from 'payload'

// Define user roles
export type UserRole = 'admin' | 'editor' | 'viewer'

// Interface for our User type with role
export interface UserWithRole {
  id: string | number
  email: string
  role: UserRole
  firstName?: string
  lastName?: string
}

// Collection-level access functions
// Check if user is authenticated
export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

// Debug version to see what's happening
export const isAuthenticatedDebug: Access = ({ req: { user, headers } }) => {
  console.log('=== DEBUG ACCESS ===')
  console.log(
    'User:',
    user ? { id: user.id, email: user.email, role: (user as UserWithRole).role } : 'No user',
  )
  console.log('Authorization header:', headers.get('authorization'))
  console.log('X-API-Key header:', headers.get('x-api-key'))
  console.log('===================')

  return Boolean(user)
}

// Temporary - allow any authenticated user regardless of role
export const isAnyAuthenticatedUser: Access = ({ req: { user } }) => {
  console.log('=== ANY USER DEBUG ===')
  console.log('User exists:', Boolean(user))
  if (user) {
    console.log('User details:', {
      id: user.id,
      email: user.email,
      role: (user as UserWithRole).role,
    })
  }
  console.log('=====================')
  return Boolean(user)
}

// Check if user is admin
export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user && (user as UserWithRole).role === 'admin')
}

// Check if user is admin or editor
export const isAdminOrEditor: Access = ({ req: { user } }) => {
  const userRole = (user as UserWithRole)?.role
  return Boolean(user && (userRole === 'admin' || userRole === 'editor'))
}

// Check if user is admin, editor, or viewer (any authenticated user)
export const isAnyRole: Access = ({ req: { user } }) => {
  const userRole = (user as UserWithRole)?.role
  return Boolean(user && ['admin', 'editor', 'viewer'].includes(userRole))
}

// Check if user owns the document or is admin
export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (!user) return false

  const userRole = (user as UserWithRole)?.role

  // Admin can access everything
  if (userRole === 'admin') return true

  // Users can only access their own records
  return user.id === id
}

// Check if user is admin or owns the uploaded file (for media)
export const isAdminOrOwner: Access = ({ req: { user }, data }) => {
  if (!user) return false

  const userRole = (user as UserWithRole)?.role

  // Admin can access everything
  if (userRole === 'admin') return true

  // Check if user uploaded this file (media files have an uploadedBy field)
  return data?.uploadedBy === user.id
}

// Public read access
export const isPublic: Access = () => true

// Field-level access functions
export const isAdminField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user && (user as UserWithRole).role === 'admin')
}

export const isAdminOrEditorField: FieldAccess = ({ req: { user } }) => {
  const userRole = (user as UserWithRole)?.role
  return Boolean(user && (userRole === 'admin' || userRole === 'editor'))
}

export const isAuthenticatedField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user)
}
