
import { BP4FormData } from '../types';

export interface BP4HookResult {
  formData: BP4FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP4FormData>>;
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}
