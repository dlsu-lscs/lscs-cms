// Define user roles
export type UserRoleType = (typeof UserRoles)[number]
export const UserRoles = ['admin', 'editor', 'viewer']
export type DomainType = (typeof Domains)[number]
export const Domains = ['lscs', 'global']

// Interface for our User type with role
export interface UsersType {
  id: string | number
  email: string
  role: UserRoleType
  domain: DomainType
  firstName?: string
  lastName?: string
}

export * from './global'
export * from './lscs'
