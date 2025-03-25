
import { BP11FormData } from '../types';

export interface BP11HookResult {
  formData: BP11FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP11FormData>>;
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}
