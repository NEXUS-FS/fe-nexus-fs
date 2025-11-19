export type ErrorResponse = {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

export type LoginResponse = {
  expiresAt: string
  logResopnse: { 
    accessToken: string
    refreshToken: string
    expiresAt: string
    user: {
      id: string
      username: string
      email: string
      role: string
      provider: string
      isActive: boolean
      createdAt: string
      updatedAt: string | null
      lastLogin: string | null
    }
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
  name?: string // Optional for backward compatibility
  role: UserRoleType
  status: UserStatusType
  provider: AuthProviderType
  isActive?: boolean // Optional for backward compatibility
  createdAt: string
  updatedAt: string | null
  lastLogin?: string | null // Optional field
}

export type PaginationMeta = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

// Generic paginated response type
export type PaginatedResponse<T> = {
  data: T[]
  pagination: PaginationMeta
}

// Specific users list response
export type UsersListResponse = {
  users: User[]
  pagination: PaginationMeta
}

export type UpdateUserRequest = {
  username?: string
  name?: string
  email?: string
  role?: UserRoleType
  status?: UserStatusType
}

// Alias for backward compatibility
export type UpdateUserData = UpdateUserRequest

export type UserFilters = {
  search?: string
  role?: UserRoleType
  status?: UserStatusType
  page?: number
  limit?: number
}