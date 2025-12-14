import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Blogify password",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Forgot your password?
        </h1>
        <p className="text-slate-600">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
