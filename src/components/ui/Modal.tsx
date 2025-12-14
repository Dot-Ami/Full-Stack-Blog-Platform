"use client";

import { useEffect, useRef, useId } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** Optional description for screen readers */
  description?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  description,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      // Focus the close button when modal opens
      closeButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="presentation"
    >
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in"
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        className={cn(
          "relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto animate-in zoom-in-95 slide-in-from-bottom-4",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 id={titleId} className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        )}
        {description && (
          <p id={descId} className="sr-only">
            {description}
          </p>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

