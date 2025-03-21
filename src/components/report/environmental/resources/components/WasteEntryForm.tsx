
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Save, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/hooks/use-report-context';
import { supabase } from '@/integrations/supabase/client';

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
  const { toast } = useToast();
  const { setNeedsSaving } = useReport();
  
  const [formData, setFormData] = useState({
    waste_description: initialData?.waste_description || '',
    total_waste: initialData?.total_waste || null,
    recycled_waste: initialData?.recycled_waste || null,
    disposal_waste: initialData?.disposal_waste || null
  });
  
  const isValid = formData.waste_description.trim() !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'waste_description') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      // For numeric fields, convert to number or null if empty
      const numValue = value === '' ? null : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportId) {
      toast({
        title: "Errore",
        description: "ID Report non valido",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (initialData?.id) {
        // Update existing entry
        const { error } = await supabase
          .from('waste_management')
          .update({
            waste_description: formData.waste_description,
            total_waste: formData.total_waste,
            recycled_waste: formData.recycled_waste,
            disposal_waste: formData.disposal_waste,
            updated_at: new Date().toISOString()
          })
          .eq('id', initialData.id);
          
        if (error) throw error;
        
        toast({
          title: "Successo",
          description: "Dati dei rifiuti aggiornati con successo"
        });
      } else {
        // Insert new entry
        const { error } = await supabase
          .from('waste_management')
          .insert({
            report_id: reportId,
            waste_type: wasteType,
            waste_description: formData.waste_description,
            total_waste: formData.total_waste,
            recycled_waste: formData.recycled_waste,
            disposal_waste: formData.disposal_waste
          });
          
        if (error) throw error;
        
        toast({
          title: "Successo",
          description: "Dati dei rifiuti salvati con successo"
        });
      }
      
      setNeedsSaving(true);
      onSaved();
    } catch (error: any) {
      console.error("Error saving waste data:", error);
      toast({
        title: "Errore",
        description: `Errore: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-white">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">
          {initialData ? 'Modifica' : 'Nuovo'} rifiuto {wasteType === 'hazardous' ? 'pericoloso' : 'non pericoloso'}
        </h4>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
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
        <div>
          <Label htmlFor="total_waste">Totale Rifiuti (t)</Label>
          <Input
            id="total_waste"
            name="total_waste"
            type="number"
            step="0.01"
            value={formData.total_waste === null ? '' : formData.total_waste}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
        
        <div>
          <Label htmlFor="recycled_waste">Destinati a Riciclo o Riutilizzo (t)</Label>
          <Input
            id="recycled_waste"
            name="recycled_waste"
            type="number"
            step="0.01"
            value={formData.recycled_waste === null ? '' : formData.recycled_waste}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
        
        <div>
          <Label htmlFor="disposal_waste">Destinati a Smaltimento (t)</Label>
          <Input
            id="disposal_waste"
            name="disposal_waste"
            type="number"
            step="0.01"
            value={formData.disposal_waste === null ? '' : formData.disposal_waste}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
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
