import Image from "next/image";
import { cn } from "@/lib/utils";

interface FeaturedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function FeaturedImage({
  src,
  alt,
  className,
  priority = false,
}: FeaturedImageProps) {
  return (
    <div
      className={cn(
        "relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

