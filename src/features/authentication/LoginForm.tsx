import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field"
import { PasswordField } from "@/components/auth/PasswordField"
import { SocialLoginButton } from "@/components/auth/SocialLoginButton"
import { UsernameField } from "@/components/auth/UsernameField"
import FormHeader from "@/components/auth/FormHeader"
import { useLoginForm } from "@/hooks/auth/useLoginForm"
import GoogleIcon from "@/components/icons/GoogleIcon"
import { SignUpPrompt } from "@/components/auth/SignUpPrompt"

export function LoginForm({ 
    className,
    ...props 
}: React.ComponentProps<"form">) {
    const {
        username, 
        setUsername,
        password, 
        setPassword, 
        handleSubmit, 
        isLoading, 
        error
    } = useLoginForm()

    return (
      <form 
        className={cn("flex flex-col gap-6", className)} 
        onSubmit={handleSubmit} 
        data-testid="login-form"
        {...props}
      >
        <FieldGroup>
          <FormHeader />
          
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <UsernameField
            value={username}
            onChange={setUsername}
            disabled={isLoading}
          />

          <PasswordField 
            value={password}
            onChange={setPassword}
            disabled={isLoading}
          />

          <Field>
            <Button type="submit" disabled={isLoading} className="font-mac-medium">
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Field>

          <FieldSeparator>Or continue with</FieldSeparator>

          <Field>
            <SocialLoginButton 
              provider="Google" 
              icon={<GoogleIcon />}
              disabled={isLoading}
            />
            <SignUpPrompt />
          </Field>
        </FieldGroup>
      </form>
    )
}