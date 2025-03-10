
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Trash2, Mail } from 'lucide-react';
import { Stakeholder } from './types';

interface StakeholderItemProps {
  stakeholder: Stakeholder;
  onStakeholderChange: (id: string, field: keyof Stakeholder, value: any) => void;
  onRemoveStakeholder: (id: string) => void;
  getStakeholderPriorityColor: (priority: string) => string;
  getSurveyStatusColor: (status?: string) => string;
  getSurveyStatusText: (status?: string) => string;
}

const StakeholderItem: React.FC<StakeholderItemProps> = ({ 
  stakeholder, 
  onStakeholderChange, 
  onRemoveStakeholder,
  getStakeholderPriorityColor,
  getSurveyStatusColor,
  getSurveyStatusText
}) => {
  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <h4 className="font-medium">{stakeholder.name}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${getStakeholderPriorityColor(stakeholder.priority)}`}>
              Priorità: {stakeholder.priority}
            </span>
            {stakeholder.surveyStatus && (
              <span className={`text-xs px-2 py-1 rounded-full ${getSurveyStatusColor(stakeholder.surveyStatus)}`}>
                Sondaggio: {getSurveyStatusText(stakeholder.surveyStatus)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Categoria: {stakeholder.category}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Mail className="inline-block h-4 w-4 mr-1" /> 
            {stakeholder.email}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onRemoveStakeholder(stakeholder.id)}
          className="h-8 w-8 text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <div className="flex justify-between mb-2">
            <Label>Livello di influenza: {stakeholder.influence}%</Label>
          </div>
          <Slider
            value={[stakeholder.influence]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => onStakeholderChange(stakeholder.id, 'influence', value[0])}
            className="mb-4"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Livello di interesse: {stakeholder.interest}%</Label>
          </div>
          <Slider
            value={[stakeholder.interest]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => onStakeholderChange(stakeholder.id, 'interest', value[0])}
            className="mb-4"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <Label>Informazioni di contatto</Label>
          <Input
            value={stakeholder.contactInfo}
            onChange={(e) => onStakeholderChange(stakeholder.id, 'contactInfo', e.target.value)}
            placeholder="Telefono, indirizzo, ecc."
          />
        </div>
        
        <div>
          <Label>Note</Label>
          <Input
            value={stakeholder.notes}
            onChange={(e) => onStakeholderChange(stakeholder.id, 'notes', e.target.value)}
            placeholder="Note aggiuntive"
          />
        </div>
      </div>
    </div>
  );
};

export default StakeholderItem;
