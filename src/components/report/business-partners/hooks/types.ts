
import React from 'react';

export interface SaveButtonProps {
  onClick: () => Promise<void | boolean>;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}
