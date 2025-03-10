
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PlusCircle } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stakeholder } from './types';

interface AddStakeholderFormProps {
  stakeholderCategories: string[];
  onAddStakeholder: (stakeholder: Omit<Stakeholder, 'id' | 'priority' | 'surveyStatus'>) => void;
}

const AddStakeholderForm: React.FC<AddStakeholderFormProps> = ({ 
  stakeholderCategories,
  onAddStakeholder 
}) => {
  const [newStakeholder, setNewStakeholder] = useState<Omit<Stakeholder, 'id' | 'priority' | 'surveyStatus'>>({
    name: '',
    category: '',
    influence: 50,
    interest: 50,
    contactInfo: '',
    email: '',
    notes: '',
  });

  const handleAddStakeholder = () => {
    if (newStakeholder.name.trim() && newStakeholder.category && newStakeholder.email.trim()) {
      onAddStakeholder(newStakeholder);
      setNewStakeholder({
        name: '',
        category: '',
        influence: 50,
        interest: 50,
        contactInfo: '',
        email: '',
        notes: '',
      });
    }
  };

  return (
    <GlassmorphicCard className="bg-gray-50 dark:bg-gray-800/50">
      <div className="flex items-center mb-4">
        <PlusCircle className="mr-2 h-5 w-5 text-blue-500" />
        <h4 className="text-lg font-medium">Aggiungi un nuovo stakeholder</h4>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stakeholderName">Nome dello stakeholder</Label>
            <Input
              id="stakeholderName"
              value={newStakeholder.name}
              onChange={(e) => setNewStakeholder({...newStakeholder, name: e.target.value})}
              placeholder="Es. Associazione Consumatori Italiani"
            />
          </div>
          
          <div>
            <Label htmlFor="stakeholderCategory">Categoria</Label>
            <Select
              value={newStakeholder.category}
              onValueChange={(value) => setNewStakeholder({...newStakeholder, category: value})}
            >
              <SelectTrigger id="stakeholderCategory">
                <SelectValue placeholder="Seleziona una categoria" />
              </SelectTrigger>
              <SelectContent>
                {stakeholderCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="stakeholderEmail" className="flex items-center">
            Email <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="stakeholderEmail"
            type="email"
            value={newStakeholder.email}
            onChange={(e) => setNewStakeholder({...newStakeholder, email: e.target.value})}
            placeholder="email@esempio.com"
            required
            className="border-red-200 focus-visible:ring-red-300"
          />
          <p className="text-xs text-red-500 mt-1">
            Campo obbligatorio per l'invio dei sondaggi di materialità
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Livello di influenza: {newStakeholder.influence}%</Label>
            <Slider
              value={[newStakeholder.influence]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setNewStakeholder({...newStakeholder, influence: value[0]})}
              className="mb-4"
            />
            <p className="text-xs text-gray-500">
              Quanto lo stakeholder può influenzare le decisioni e le attività dell'organizzazione
            </p>
          </div>
          
          <div>
            <Label>Livello di interesse: {newStakeholder.interest}%</Label>
            <Slider
              value={[newStakeholder.interest]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setNewStakeholder({...newStakeholder, interest: value[0]})}
              className="mb-4"
            />
            <p className="text-xs text-gray-500">
              Quanto lo stakeholder è interessato alle questioni di sostenibilità dell'organizzazione
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stakeholderContact">Altre informazioni di contatto</Label>
            <Input
              id="stakeholderContact"
              value={newStakeholder.contactInfo}
              onChange={(e) => setNewStakeholder({...newStakeholder, contactInfo: e.target.value})}
              placeholder="Telefono, indirizzo, ecc."
            />
          </div>
          
          <div>
            <Label htmlFor="stakeholderNotes">Note</Label>
            <Input
              id="stakeholderNotes"
              value={newStakeholder.notes}
              onChange={(e) => setNewStakeholder({...newStakeholder, notes: e.target.value})}
              placeholder="Note aggiuntive"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleAddStakeholder}
          className="w-full"
          disabled={!newStakeholder.name.trim() || !newStakeholder.category || !newStakeholder.email.trim()}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Aggiungi stakeholder
        </Button>
      </div>
    </GlassmorphicCard>
  );
};

export default AddStakeholderForm;
