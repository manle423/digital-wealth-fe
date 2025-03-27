import LoginForm from "@/components/forms/auth/login-form";

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center">Login Page</h1>
      <div className="flex justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
}
