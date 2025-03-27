
import { BP6FormData, BaseHookResult } from '../types';

export interface BP6HookResult extends BaseHookResult<BP6FormData> {
  isSaving: boolean;
}
