
import { BP9FormData } from '../types';

export interface BP9HookResult {
  formData: BP9FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP9FormData>>;
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}
