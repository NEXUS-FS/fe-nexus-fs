export type ErrorResponse = {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

export type LoginResponse = {
    token: string
    user?: {
        id: string
        username: string 
        name: string 
    }
}

export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
} as const

export type UserRoleType = typeof UserRole[keyof typeof UserRole]

export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

export type UserStatusType = typeof UserStatus[keyof typeof UserStatus]

export const AuthProvider = {
  LOCAL: 'local',
  GOOGLE: 'google',
} as const

export type AuthProviderType = typeof AuthProvider[keyof typeof AuthProvider]

export type User = {
  id: string
  username: string
  email: string
  role: UserRoleType
  status: UserStatusType
  provider: AuthProviderType
  createdAt: string
  updatedAt?: string
}

export type PaginationMeta = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export type UsersListResponse = {
  users: User[]
  pagination: PaginationMeta
}

export type UpdateUserRequest = {
  username?: string
  email?: string
  role?: UserRoleType
  status?: UserStatusType
}

export type UserFilters = {
  search?: string
  role?: UserRoleType
  status?: UserStatusType
  page?: number
  limit?: number
}