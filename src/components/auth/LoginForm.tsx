"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Login failed",
          description: result.error,
          variant: "destructive",
        });
        setErrors({ form: result.error });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
          variant: "success",
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    // #region agent log
    console.log('[DEBUG] Google sign-in button clicked, callbackUrl:', callbackUrl);
    fetch('http://127.0.0.1:7242/ingest/5c271481-2db8-40f6-918c-db51e6f1a413',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginForm.tsx:66',message:'Google sign-in initiated',data:{callbackUrl,hypothesisId:'H3'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1'})}).catch((e)=>{console.log('[DEBUG] Log fetch failed:', e);});
    // #endregion
    try {
      // #region agent log
      console.log('[DEBUG] Calling signIn("google") with options:', { callbackUrl });
      fetch('http://127.0.0.1:7242/ingest/5c271481-2db8-40f6-918c-db51e6f1a413',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginForm.tsx:70',message:'Calling signIn with google provider',data:{provider:'google',options:{callbackUrl},hypothesisId:'H3'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1'})}).catch((e)=>{console.log('[DEBUG] Log fetch failed:', e);});
      // #endregion
      await signIn("google", { callbackUrl });
    } catch {
      toast({
        title: "Error",
        description: "Failed to sign in with Google.",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        size="lg"
        onClick={handleGoogleSignIn}
        isLoading={isGoogleLoading}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">or continue with email</span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.form && (
          <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-sm text-rose-600 dark:text-rose-400">
            {errors.form}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="pl-11"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="pl-11"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Sign in
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
