
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from 'lucide-react';
import { useWasteEntryForm } from '../hooks/useWasteEntryForm';
import WasteNumericField from './WasteNumericField';
import WasteFormHeader from './WasteFormHeader';

interface WasteEntryFormProps {
  reportId: string | undefined;
  wasteType: 'hazardous' | 'non-hazardous';
  onSaved: () => void;
  initialData?: {
    id: string;
    waste_description: string;
    total_waste: number | null;
    recycled_waste: number | null;
    disposal_waste: number | null;
  } | null;
  onCancel: () => void;
}

const WasteEntryForm: React.FC<WasteEntryFormProps> = ({
  reportId,
  wasteType,
  onSaved,
  initialData,
  onCancel
}) => {
  const {
    formData,
    isValid,
    handleChange,
    handleSubmit,
    onCancel: handleCancel
  } = useWasteEntryForm({
    reportId,
    wasteType,
    initialData,
    onSaved,
    onCancel
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-white">
      <WasteFormHeader 
        isEditing={!!initialData} 
        wasteType={wasteType} 
        onCancel={handleCancel} 
      />
      
      <div>
        <Label htmlFor="waste_description">Descrizione Rifiuto</Label>
        <Textarea
          id="waste_description"
          name="waste_description"
          value={formData.waste_description}
          onChange={handleChange}
          placeholder="Descrivi il tipo di rifiuto"
          className="min-h-[80px]"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <WasteNumericField
          id="total_waste"
          name="total_waste"
          label="Totale Rifiuti (t)"
          value={formData.total_waste}
          onChange={handleChange}
        />
        
        <WasteNumericField
          id="recycled_waste"
          name="recycled_waste"
          label="Destinati a Riciclo o Riutilizzo (t)"
          value={formData.recycled_waste}
          onChange={handleChange}
        />
        
        <WasteNumericField
          id="disposal_waste"
          name="disposal_waste"
          label="Destinati a Smaltimento (t)"
          value={formData.disposal_waste}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Annulla
        </Button>
        <Button type="submit" disabled={!isValid}>
          <Save className="mr-2 h-4 w-4" />
          Salva
        </Button>
      </div>
    </form>
  );
};

export default WasteEntryForm;
