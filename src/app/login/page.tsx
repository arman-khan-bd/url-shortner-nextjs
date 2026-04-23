import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="container flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
