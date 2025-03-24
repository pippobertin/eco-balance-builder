
// This file re-exports toast functions from the sonner package
import { toast as sonnerToast } from "sonner";
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

// Export the shadcn toast hook for compatibility
export const useToast = useShadcnToast;

// We're not using this custom function anymore as it caused type errors
// Instead, we directly export the sonner toast
export const toast = sonnerToast;
