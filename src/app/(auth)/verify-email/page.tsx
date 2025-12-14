import { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailHandler } from "@/components/auth/VerifyEmailHandler";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address",
};

export default function VerifyEmailPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Verifying your email...</p>
          </div>
        }
      >
        <VerifyEmailHandler />
      </Suspense>
    </div>
  );
}
