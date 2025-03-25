
import { BP8FormData } from '../types';

export interface BP8HookResult {
  formData: BP8FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP8FormData>>;
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}
