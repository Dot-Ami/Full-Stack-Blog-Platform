import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  const sizeClass = sizeClasses[size];

  if (src) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden bg-slate-100 ring-2 ring-white shadow-sm",
          sizeClass,
          className
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold bg-gradient-to-br from-indigo-500 to-purple-600 text-white ring-2 ring-white shadow-sm",
        sizeClass,
        className
      )}
    >
      {getInitials(alt)}
    </div>
  );
}

