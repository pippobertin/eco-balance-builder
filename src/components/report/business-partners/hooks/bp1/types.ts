
import { BP1FormData } from '../types';

export interface BP1HookResult {
  formData: BP1FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP1FormData>>;
  isLoading: boolean;
  saveData: () => Promise<void>;
  lastSaved: Date | null;
  needsSaving: boolean;
}
