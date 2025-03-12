
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StakeholderContactProps {
  contactInfo: string;
  notes: string;
  onContactInfoChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

const StakeholderContact: React.FC<StakeholderContactProps> = ({
  contactInfo,
  notes,
  onContactInfoChange,
  onNotesChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="stakeholderContact">Altre informazioni di contatto</Label>
        <Input
          id="stakeholderContact"
          value={contactInfo}
          onChange={(e) => onContactInfoChange(e.target.value)}
          placeholder="Telefono, indirizzo, ecc."
        />
      </div>
      
      <div>
        <Label htmlFor="stakeholderNotes">Note</Label>
        <Input
          id="stakeholderNotes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Note aggiuntive"
        />
      </div>
    </div>
  );
};

export default StakeholderContact;
