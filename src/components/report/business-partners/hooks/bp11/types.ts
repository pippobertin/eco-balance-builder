
import { BP11FormData } from '../../hooks/types';

export interface BP11HookResult {
  formData: BP11FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP11FormData>>;
  isLoading: boolean;
  isSaving: boolean; // Added this property to match what's returned by the hook
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
  totalEmployees: number | null;
}
