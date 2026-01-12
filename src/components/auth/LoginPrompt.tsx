import { Link } from 'react-router-dom';

export function LoginPrompt() {
  return (
    <div className="text-center text-sm mt-4">
      <span className="text-gray-600">Already have an account? </span>
      <Link
        to="/"
        className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
      >
        Log in
      </Link>
    </div>
  );
}
