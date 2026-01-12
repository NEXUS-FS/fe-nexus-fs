import { FieldDescription } from '@/components/ui/field';
import { Link } from 'react-router-dom';

export function SignUpPrompt() {
  return (
    <FieldDescription className="text-center">
      Don&apos;t have an account?{' '}
      <Link to="/register" className="underline underline-offset-4">
        Sign up
      </Link>
    </FieldDescription>
  );
}
