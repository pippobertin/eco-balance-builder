
import { BP6FormData } from '../types';

export interface BP6HookResult {
  formData: BP6FormData;
  setFormData: React.Dispatch<React.SetStateAction<BP6FormData>>;
  isLoading: boolean;
  saveData: () => Promise<boolean>;
  lastSaved: Date | null;
  needsSaving: boolean;
}
