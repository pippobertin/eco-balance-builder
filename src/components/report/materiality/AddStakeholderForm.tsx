
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import StakeholderBasicInfo from './components/stakeholder-form/StakeholderBasicInfo';
import StakeholderInfluence from './components/stakeholder-form/StakeholderInfluence';
import StakeholderContact from './components/stakeholder-form/StakeholderContact';
import StakeholderFormActions from './components/stakeholder-form/StakeholderFormActions';
import { Stakeholder } from './types';

interface AddStakeholderFormProps {
  stakeholderCategories?: string[];
  onAddStakeholder: (stakeholder: Omit<Stakeholder, 'id' | 'priority' | 'surveyStatus'>) => void;
  onCancel?: () => void;
}

const AddStakeholderForm: React.FC<AddStakeholderFormProps> = ({ 
  stakeholderCategories = [
    "Dipendenti",
    "Clienti",
    "Fornitori",
    "Investitori",
    "Comunità locali",
    "ONG",
    "Istituzioni",
    "Media",
    "Partner commerciali",
    "Altro"
  ],
  onAddStakeholder,
  onCancel
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
      if (onCancel) {
        onCancel();
      }
    }
  };

  const updateField = <K extends keyof typeof newStakeholder>(
    field: K,
    value: typeof newStakeholder[K]
  ) => {
    setNewStakeholder(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = newStakeholder.name.trim() && 
    newStakeholder.category && 
    newStakeholder.email.trim();

  return (
    <GlassmorphicCard className="bg-gray-50 dark:bg-gray-800/50">
      <div className="flex items-center mb-4">
        <PlusCircle className="mr-2 h-5 w-5 text-blue-500" />
        <h4 className="text-lg font-medium">Aggiungi un nuovo stakeholder</h4>
      </div>
      
      <div className="space-y-4">
        <StakeholderBasicInfo 
          name={newStakeholder.name}
          category={newStakeholder.category}
          email={newStakeholder.email}
          stakeholderCategories={stakeholderCategories}
          onNameChange={(value) => updateField('name', value)}
          onCategoryChange={(value) => updateField('category', value)}
          onEmailChange={(value) => updateField('email', value)}
        />
        
        <StakeholderInfluence 
          influence={newStakeholder.influence}
          interest={newStakeholder.interest}
          onInfluenceChange={(value) => updateField('influence', value)}
          onInterestChange={(value) => updateField('interest', value)}
        />
        
        <StakeholderContact 
          contactInfo={newStakeholder.contactInfo}
          notes={newStakeholder.notes}
          onContactInfoChange={(value) => updateField('contactInfo', value)}
          onNotesChange={(value) => updateField('notes', value)}
        />
        
        <StakeholderFormActions 
          isValid={isFormValid}
          onCancel={onCancel}
          onSubmit={handleAddStakeholder}
        />
      </div>
    </GlassmorphicCard>
  );
};

export default AddStakeholderForm;
