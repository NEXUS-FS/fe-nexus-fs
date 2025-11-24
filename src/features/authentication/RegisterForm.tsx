import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldSeparator } from '@/components/ui/field';
import { PasswordField } from '../../components/auth/PasswordField';
import { SocialLoginButton } from '../../components/auth/SocialLoginButton';
import { UsernameField } from '../../components/auth/UsernameField';
import { useRegisterForm } from '@/hooks/auth/useRegisterForm';
import GoogleIcon from '../../components/icons/GoogleIcon';
import { LoginPrompt } from '../../components/auth/LoginPrompt';

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isLoading,
    error,
  } = useRegisterForm();

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-mac-medium">Create Account</h1>
          <p className="text-muted-foreground text-sm text-balance mt-2">
            Sign up to get Started
          </p>
        </div>

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

        <Field>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Field>

        <PasswordField
          value={password}
          onChange={setPassword}
          disabled={isLoading}
        />

        <Field>
          <Button
            type="submit"
            disabled={isLoading}
            className="font-mac-medium"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <SocialLoginButton
            provider="Google"
            icon={<GoogleIcon />}
            disabled={isLoading}
          />
          <LoginPrompt />
        </Field>
      </FieldGroup>
    </form>
  );
}
