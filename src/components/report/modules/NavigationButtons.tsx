
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface NavigationButtonsProps {
  onPrevious: () => void;
  onSave: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ onPrevious, onSave }) => {
  return (
    <div className="flex justify-between pt-6">
      <Button variant="outline" onClick={onPrevious}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Torna indietro
      </Button>
      <Button onClick={onSave}>
        Salva e continua
      </Button>
    </div>
  );
};

export default NavigationButtons;
