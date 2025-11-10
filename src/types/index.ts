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

export type User = {
  id: string
  username: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export type PaginatedResponse<T> = {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export type UpdateUserData = {
  username?: string
  name?: string
  email?: string
  role?: string
}