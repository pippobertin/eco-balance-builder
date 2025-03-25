
import { BP2FormData } from '../types';

export interface BP2HookResult {
  formData: BP2FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP2FormData>>;
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}
