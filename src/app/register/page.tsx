import { RegisterForm } from '@/components/register-form';

export default function RegisterPage() {
  return (
    <div className="container flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
