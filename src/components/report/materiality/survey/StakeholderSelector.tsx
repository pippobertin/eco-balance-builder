
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Stakeholder } from '../types';

interface StakeholderSelectorProps {
  stakeholders: Stakeholder[];
  selectedStakeholders: string[];
  onStakeholderSelection: (id: string) => void;
  toggleSelectAllStakeholders: () => void;
  getStakeholderPriorityColor: (priority: string) => string;
}

const StakeholderSelector: React.FC<StakeholderSelectorProps> = ({
  stakeholders,
  selectedStakeholders,
  onStakeholderSelection,
  toggleSelectAllStakeholders,
  getStakeholderPriorityColor
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Seleziona gli stakeholder</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={toggleSelectAllStakeholders}
        >
          {selectedStakeholders.length === stakeholders.length 
            ? "Deseleziona tutti" 
            : "Seleziona tutti"}
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="max-h-64 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Seleziona
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priorità
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {stakeholders.map((stakeholder) => (
                <tr key={stakeholder.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox 
                      checked={selectedStakeholders.includes(stakeholder.id)} 
                      onCheckedChange={() => onStakeholderSelection(stakeholder.id)}
                      id={`select-${stakeholder.id}`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Label 
                      htmlFor={`select-${stakeholder.id}`}
                      className="font-medium text-gray-900 dark:text-gray-100"
                    >
                      {stakeholder.name}
                    </Label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {stakeholder.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStakeholderPriorityColor(stakeholder.priority)}`}>
                      {stakeholder.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {stakeholder.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Nota</AlertTitle>
        <AlertDescription>
          Solo gli stakeholder selezionati riceveranno il sondaggio via email.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default StakeholderSelector;
