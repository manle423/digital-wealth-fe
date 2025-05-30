import ForgotPasswordForm from "@/components/forms/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center">Reset Password</h1>
      <div className="flex justify-center items-center mt-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
} 