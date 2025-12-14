"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
  /** Accessible label for the dropdown menu */
  label?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "right",
  className,
  label,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeDropdown]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      // Focus first item when opening with keyboard
      setTimeout(() => {
        const firstItem = menuRef.current?.querySelector("button");
        firstItem?.focus();
      }, 0);
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    const items = menuRef.current?.querySelectorAll("button:not([disabled])");
    if (!items?.length) return;

    const currentIndex = Array.from(items).findIndex(
      (item) => item === document.activeElement
    );

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      (items[nextIndex] as HTMLElement).focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      (items[prevIndex] as HTMLElement).focus();
    } else if (e.key === "Tab") {
      closeDropdown();
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? menuId : undefined}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={handleMenuKeyDown}
          className={cn(
            "absolute z-50 mt-2 min-w-[200px] rounded-xl bg-white border border-slate-200 shadow-lg py-1 animate-in fade-in slide-in-from-top-2",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
}

export function DropdownItem({
  className,
  danger,
  ...props
}: DropdownItemProps) {
  return (
    <button
      role="menuitem"
      className={cn(
        "w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2",
        "focus:outline-none focus:bg-slate-100",
        danger
          ? "text-rose-600 hover:bg-rose-50 focus:bg-rose-50"
          : "text-slate-700 hover:bg-slate-50",
        className
      )}
      {...props}
    />
  );
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-slate-100" />;
}

