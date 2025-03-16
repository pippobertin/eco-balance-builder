
import { Toast, ToasterToast } from "./types";
import { dispatch } from "./reducer";

// Counter for generating unique IDs
let count = 0;

export function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
    
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

// Helper methods
toast.loading = (message: string, options = {}) => {
  return toast({
    title: "Loading",
    description: message,
    ...options,
  });
};

toast.success = (message: string, options = {}) => {
  return toast({
    title: "Success",
    description: message,
    ...options,
  });
};

toast.error = (message: string, options = {}) => {
  return toast({
    title: "Error",
    description: message,
    variant: "destructive",
    ...options,
  });
};
