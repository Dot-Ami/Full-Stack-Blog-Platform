import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Blogify account and start writing",
};

export default function RegisterPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Create your account
        </h1>
        <p className="text-slate-600">
          Start sharing your stories with the world
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}

