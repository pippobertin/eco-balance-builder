
import { BP10FormData } from '../types';

export interface BP10HookResult {
  formData: BP10FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP10FormData>>;
  isLoading: boolean;
  isSaving: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}
