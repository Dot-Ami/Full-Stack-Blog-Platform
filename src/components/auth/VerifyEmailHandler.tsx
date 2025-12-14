"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

type VerificationStatus = "loading" | "success" | "error" | "no-token";

export function VerifyEmailHandler() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerificationStatus>(
    token ? "loading" : "no-token"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to verify email");
        }

        setStatus("success");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Verifying your email...
          </h2>
          <p className="text-slate-600">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Email verified!
          </h2>
          <p className="text-slate-600">
            Your email has been verified successfully. You can now enjoy all
            features of Blogify.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/dashboard">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-8 h-8 text-rose-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Verification failed
          </h2>
          <p className="text-slate-600">{error}</p>
        </div>
        <div className="pt-4 space-y-3">
          <Link href="/dashboard">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
          <p className="text-sm text-slate-500">
            You can request a new verification email from your dashboard.
          </p>
        </div>
      </div>
    );
  }

  // No token provided
  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
        <Mail className="w-8 h-8 text-amber-600" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Check your email
        </h2>
        <p className="text-slate-600">
          We&apos;ve sent you a verification link. Click the link in your email
          to verify your account.
        </p>
      </div>
      <div className="pt-4">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
