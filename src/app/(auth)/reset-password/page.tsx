import { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your Blogify account",
};

export default function ResetPasswordPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Reset your password
        </h1>
        <p className="text-slate-600">
          Enter a new password for your account.
        </p>
      </div>
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
