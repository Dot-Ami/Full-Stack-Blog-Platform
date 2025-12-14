"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setIsSuccess(true);
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
            Check your email
          </h2>
          <p className="text-slate-600">
            If an account exists for <strong>{email}</strong>, you will receive
            a password reset link shortly.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Button>
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
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
        disabled={isLoading}
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        <Mail className="w-4 h-4" />
        Send reset link
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
