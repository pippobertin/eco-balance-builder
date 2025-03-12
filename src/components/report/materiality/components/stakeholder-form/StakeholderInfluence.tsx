
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface StakeholderInfluenceProps {
  influence: number;
  interest: number;
  onInfluenceChange: (value: number) => void;
  onInterestChange: (value: number) => void;
}

const StakeholderInfluence: React.FC<StakeholderInfluenceProps> = ({
  influence,
  interest,
  onInfluenceChange,
  onInterestChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>Livello di influenza: {influence}%</Label>
        <Slider
          value={[influence]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => onInfluenceChange(value[0])}
          className="mb-4"
        />
        <p className="text-xs text-gray-500">
          Quanto lo stakeholder può influenzare le decisioni e le attività dell'organizzazione
        </p>
      </div>
      
      <div>
        <Label>Livello di interesse: {interest}%</Label>
        <Slider
          value={[interest]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => onInterestChange(value[0])}
          className="mb-4"
        />
        <p className="text-xs text-gray-500">
          Quanto lo stakeholder è interessato alle questioni di sostenibilità dell'organizzazione
        </p>
      </div>
    </div>
  );
};

export default StakeholderInfluence;
