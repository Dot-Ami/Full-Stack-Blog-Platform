"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={message}
      className="max-w-md"
    >
      <div className="space-y-4">
        {/* Warning icon for danger/warning variants */}
        {(variant === "danger" || variant === "warning") && (
          <div className="flex justify-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                variant === "danger" ? "bg-rose-100" : "bg-amber-100"
              }`}
            >
              <AlertTriangle
                className={`w-6 h-6 ${
                  variant === "danger" ? "text-rose-600" : "text-amber-600"
                }`}
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        {/* Message */}
        <p className="text-slate-600 text-center">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === "danger" ? "destructive" : "primary"}
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
