import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered";
}

export function Card({
  className,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white dark:bg-slate-800",
        {
          "shadow-sm border border-slate-200/60 dark:border-slate-700/60": variant === "default",
          "shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50": variant === "elevated",
          "border-2 border-slate-200 dark:border-slate-700": variant === "bordered",
        },
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 py-4 border-b border-slate-100 dark:border-slate-700", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-slate-500 dark:text-slate-400 mt-1", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-4", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-xl",
        className
      )}
      {...props}
    />
  );
}

