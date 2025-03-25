
import { BP5FormData } from '../types';

export interface BP5HookResult {
  formData: BP5FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP5FormData>>;
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}
