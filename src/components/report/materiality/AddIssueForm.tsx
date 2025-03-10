
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface AddIssueFormProps {
  onAddIssue: (name: string, description: string) => void;
}

const AddIssueForm: React.FC<AddIssueFormProps> = ({ onAddIssue }) => {
  const [newIssue, setNewIssue] = useState({ name: '', description: '' });

  const handleAddIssue = () => {
    if (newIssue.name.trim() && newIssue.description.trim()) {
      onAddIssue(newIssue.name, newIssue.description);
      setNewIssue({ name: '', description: '' });
    }
  };

  return (
    <GlassmorphicCard className="bg-gray-50">
      <div className="flex items-center mb-4">
        <PlusCircle className="mr-2 h-5 w-5 text-blue-500" />
        <h4 className="text-lg font-medium text-gray-900">Aggiungi una questione personalizzata</h4>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="newIssueName" className="text-gray-900">Nome della questione</Label>
          <Input
            id="newIssueName"
            value={newIssue.name}
            onChange={(e) => setNewIssue({...newIssue, name: e.target.value})}
            placeholder="Es. Gestione dei rifiuti"
            className="bg-white text-gray-900"
          />
        </div>
        
        <div>
          <Label htmlFor="newIssueDescription" className="text-gray-900">Descrizione</Label>
          <Input
            id="newIssueDescription"
            value={newIssue.description}
            onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
            placeholder="Breve descrizione della questione di sostenibilità"
            className="bg-white text-gray-900"
          />
        </div>
        
        <Button 
          onClick={handleAddIssue}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={!newIssue.name.trim() || !newIssue.description.trim()}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Aggiungi questione
        </Button>
      </div>
    </GlassmorphicCard>
  );
};

export default AddIssueForm;
