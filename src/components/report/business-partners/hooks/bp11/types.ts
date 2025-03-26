
import { BP11FormData, BaseHookResult } from '../types';

export interface BP11HookResult extends BaseHookResult<BP11FormData> {
  isSaving: boolean;
  totalEmployees: number | null;
}
