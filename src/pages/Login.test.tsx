import { render, screen } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import Login from "./Login";
import * as LoginFormModule from '@/components/auth/LoginForm'
import { AuthProvider, useAuth } from "@/context/AuthContext";
import type { PropsWithChildren } from "react";

vi.mock('@/components/auth/LoginForm', () => ({
    LoginForm: vi.fn(() => <div data-testid="login-form">LoginForm</div>)
}))

vi.mock('@/context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/context/AuthContext')>()
  return {
    ...actual,
    useAuth: vi.fn(),
    AuthProvider: ({ children }: PropsWithChildren) => <>{children}</>,
  }
})

const createWrapper = () => {
  return ({ children }: PropsWithChildren) => (
    <AuthProvider>{children}</AuthProvider>
  )
}

describe('Login Page', () => {
    beforeEach(() => {
        ;(useAuth as Mock).mockReturnValue({
            isAuthenticated: false, 
            login: vi.fn(),
            logout: vi.fn()
        })
        vi.clearAllMocks()
    })

    it('renders LoginForm component', () => {
        render(<Login />, { wrapper: createWrapper() })
        expect(screen.getByTestId('login-form')).toBeInTheDocument()
        expect(LoginFormModule.LoginForm).toHaveBeenCalled()
    })
})
