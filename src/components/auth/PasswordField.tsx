import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PasswordField({
  value,
  onChange,
  disabled,
}: PasswordFieldProps) {
  return (
    <Field>
      <div className="flex items-center">
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <a
          href="#"
          className="ml-auto text-sm underline-offset-4 hover:underline"
        >
          Forgot your password?
        </a>
      </div>
      <Input
        id="password"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
      />
    </Field>
  );
}
