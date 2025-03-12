import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Stakeholder } from '../types';
import { AlertCircle, MailCheck, Clock } from 'lucide-react';
interface StakeholderSelectorProps {
  stakeholderGroups: {
    pending: Stakeholder[];
    sent: Stakeholder[];
    completed: Stakeholder[];
  };
  selectedStakeholders: string[];
  onStakeholderSelection: (id: string) => void;
  toggleSelectAllStakeholders: () => void;
  getStakeholderPriorityColor: (priority: string) => string;
  forceResend: boolean;
  onToggleForceResend: () => void;
}
const StakeholderSelector: React.FC<StakeholderSelectorProps> = ({
  stakeholderGroups,
  selectedStakeholders,
  onStakeholderSelection,
  toggleSelectAllStakeholders,
  getStakeholderPriorityColor,
  forceResend,
  onToggleForceResend
}) => {
  const {
    pending,
    sent,
    completed
  } = stakeholderGroups;
  const allStakeholders = [...pending, ...(forceResend ? [...sent, ...completed] : [])];
  const isAllSelected = allStakeholders.length > 0 && allStakeholders.every(s => selectedStakeholders.includes(s.id));
  return <div className="space-y-4">
      <h3 className="text-lg font-medium">Seleziona gli stakeholder a cui inviare il sondaggio</h3>
      
      <div className="flex justify-between items-center p-3 rounded-md bg-slate-100">
        <div className="flex items-center gap-2">
          <Label htmlFor="force-resend" className="cursor-pointer">
            Mostra stakeholder con sondaggio già inviato/completato
          </Label>
          <Switch id="force-resend" checked={forceResend} onCheckedChange={onToggleForceResend} />
        </div>
        
        {allStakeholders.length > 0 && <Button variant="outline" size="sm" onClick={toggleSelectAllStakeholders}>
            {isAllSelected ? "Deseleziona tutti" : "Seleziona tutti"}
          </Button>}
      </div>
      
      {forceResend && <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Attenzione: stai per inviare il sondaggio anche a stakeholder che hanno già ricevuto il sondaggio. 
            Questo potrebbe causare confusione o duplicati.
          </p>
        </div>}
      
      {/* In attesa di invio */}
      <div className="space-y-2">
        <h4 className="font-medium flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          Stakeholder in attesa ({pending.length})
        </h4>
        
        {pending.length === 0 ? <p className="text-sm italic text-gray-500 dark:text-gray-400">
            Nessuno stakeholder in attesa di sondaggio
          </p> : <div className="space-y-2 p-3 rounded-md border bg-emerald-100">
            {pending.map(stakeholder => <div key={stakeholder.id} className="flex items-center space-x-2">
                <Checkbox id={`stakeholder-${stakeholder.id}`} checked={selectedStakeholders.includes(stakeholder.id)} onCheckedChange={() => onStakeholderSelection(stakeholder.id)} />
                <Label htmlFor={`stakeholder-${stakeholder.id}`} className="flex items-center">
                  <span>{stakeholder.name}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getStakeholderPriorityColor(stakeholder.priority)}`}>
                    {stakeholder.priority}
                  </span>
                </Label>
              </div>)}
          </div>}
      </div>
      
      {/* Già inviati (visibili solo se forceResend è attivo) */}
      {forceResend && sent.length > 0 && <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2 text-sm text-gray-500">
            <MailCheck className="h-4 w-4" />
            Sondaggio già inviato ({sent.length})
          </h4>
          
          <div className="space-y-2 p-3 bg-white dark:bg-gray-800 rounded-md border">
            {sent.map(stakeholder => <div key={stakeholder.id} className="flex items-center space-x-2">
                <Checkbox id={`stakeholder-${stakeholder.id}`} checked={selectedStakeholders.includes(stakeholder.id)} onCheckedChange={() => onStakeholderSelection(stakeholder.id)} />
                <Label htmlFor={`stakeholder-${stakeholder.id}`} className="flex items-center">
                  <span>{stakeholder.name}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getStakeholderPriorityColor(stakeholder.priority)}`}>
                    {stakeholder.priority}
                  </span>
                </Label>
              </div>)}
          </div>
        </div>}
      
      {/* Completati (visibili solo se forceResend è attivo) */}
      {forceResend && completed.length > 0 && <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2 text-sm text-gray-500">
            <MailCheck className="h-4 w-4 text-green-500" />
            Sondaggio completato ({completed.length})
          </h4>
          
          <div className="space-y-2 p-3 bg-white dark:bg-gray-800 rounded-md border">
            {completed.map(stakeholder => <div key={stakeholder.id} className="flex items-center space-x-2">
                <Checkbox id={`stakeholder-${stakeholder.id}`} checked={selectedStakeholders.includes(stakeholder.id)} onCheckedChange={() => onStakeholderSelection(stakeholder.id)} />
                <Label htmlFor={`stakeholder-${stakeholder.id}`} className="flex items-center">
                  <span>{stakeholder.name}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getStakeholderPriorityColor(stakeholder.priority)}`}>
                    {stakeholder.priority}
                  </span>
                </Label>
              </div>)}
          </div>
        </div>}
    </div>;
};
export default StakeholderSelector;