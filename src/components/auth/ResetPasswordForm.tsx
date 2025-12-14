"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Show error if no token
  if (!token) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-8 h-8 text-rose-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Invalid reset link
          </h2>
          <p className="text-slate-600">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/forgot-password">
            <Button className="w-full">Request new reset link</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Password reset successful!
          </h2>
          <p className="text-slate-600">
            Your password has been updated. Redirecting you to sign in...
          </p>
        </div>
        <div className="pt-4">
          <Link href="/login">
            <Button className="w-full">Sign in now</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      <Input
        label="New password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        minLength={8}
        autoComplete="new-password"
        disabled={isLoading}
        helperText="Must be at least 8 characters"
      />

      <Input
        label="Confirm new password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        required
        minLength={8}
        autoComplete="new-password"
        disabled={isLoading}
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        <Lock className="w-4 h-4" />
        Reset password
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
