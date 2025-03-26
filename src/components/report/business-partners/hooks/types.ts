
import { BP10FormData } from './bp10/types';

export interface BP10FormData {
  maleParentalLeaveEligible?: number;
  femaleParentalLeaveEligible?: number;
  maleParentalLeaveUsed?: number;
  femaleParentalLeaveUsed?: number;
}

export interface SaveButtonProps {
  onClick: () => Promise<boolean | void>;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}
