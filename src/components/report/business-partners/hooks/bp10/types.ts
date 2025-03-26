
import { BaseHookResult } from '../types';

export interface BP10FormData {
  maleFamilyLeaveEligible?: number;
  femaleFamilyLeaveEligible?: number;
  maleFamilyLeaveUsed?: number;
  femaleFamilyLeaveUsed?: number;
}

export interface BP10HookResult extends BaseHookResult<BP10FormData> {
  isSaving: boolean;
}
