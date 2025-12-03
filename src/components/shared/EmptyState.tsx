import { FileQuestion, PenSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  icon?: "posts" | "search";
}

export function EmptyState({
  title,
  description,
  action,
  icon = "posts",
}: EmptyStateProps) {
  const icons = {
    posts: FileQuestion,
    search: FileQuestion,
  };

  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 max-w-sm mb-6">{description}</p>
      {action && (
        <Link href={action.href}>
          <Button>
            <PenSquare className="w-4 h-4" />
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}

