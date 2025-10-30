export type ErrorResponse = {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

export type LoginResponse = {
    token: string
    user: {
        id: string
        username: string 
        name: string 
    }
}