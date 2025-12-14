"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, "-");
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          ref={ref}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full px-4 py-2.5 bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
            "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
            error
              ? "border-rose-500 focus:ring-rose-500"
              : "border-slate-200 hover:border-slate-300",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-rose-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };

