
import { BP7FormData } from '../types';

export interface BP7HookResult {
  formData: BP7FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP7FormData>>;
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}
