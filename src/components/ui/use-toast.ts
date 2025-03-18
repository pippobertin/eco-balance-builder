
// This file re-exports the toast hook from src/components/ui/toast.tsx
import { useToast, ToastActionElement, ToastProps, ToasterToast } from "@/components/ui/toast";

// Create a simple toast function export
const toast = ({ title, description, ...props }: { title?: string; description?: string; [key: string]: any }) => {
  const { toast: toastFunction } = useToast();
  return toastFunction({ title, description, ...props });
};

export { useToast, toast, type ToastActionElement, type ToastProps, type ToasterToast };
