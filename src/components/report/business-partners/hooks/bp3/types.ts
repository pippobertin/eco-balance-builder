
import { BP3FormData } from '../types';

export interface BP3HookResult {
  formData: BP3FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP3FormData>>;
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}
