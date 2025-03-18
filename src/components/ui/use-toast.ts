
// This is now a simple re-export file
import { useToast as useToastHook, toast as toastFunc } from "@/components/ui/toast";

export const useToast = useToastHook;
export const toast = toastFunc;
