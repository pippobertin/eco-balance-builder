
// This file re-exports toast functions from the sonner package
import { toast as sonnerToast } from "sonner";
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
  action?: React.ReactNode;
};

// Export the shadcn toast hook for compatibility
export const useToast = useShadcnToast;

// Custom toast function that works with both sonner and shadcn toasts
export const toast = ({
  title,
  description,
  variant = "default",
  duration = 3000,
  action
}: ToastProps) => {
  // Use sonner toast for its simplicity and better mobile experience
  if (variant === "destructive") {
    return sonnerToast.error(title, {
      description,
      duration,
      action
    });
  } else {
    return sonnerToast(title, {
      description,
      duration,
      action
    });
  }
};
