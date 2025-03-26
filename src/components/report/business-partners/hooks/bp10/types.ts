
import { BP10FormData, BaseHookResult } from '../types';

export interface BP10HookResult extends BaseHookResult<BP10FormData> {
  isSaving: boolean;
}
