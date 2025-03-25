
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavigationButtonsProps {
  goToPrevTab: () => void;
  goToNextTab: () => void;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  goToPrevTab,
  goToNextTab,
  isPrevDisabled,
  isNextDisabled
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        onClick={goToPrevTab}
        disabled={isPrevDisabled}
        variant="outline"
        className="flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Sezione precedente
      </Button>
      
      <Button
        onClick={goToNextTab}
        disabled={isNextDisabled}
        variant="outline"
        className="flex items-center"
      >
        Prossima sezione
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};
