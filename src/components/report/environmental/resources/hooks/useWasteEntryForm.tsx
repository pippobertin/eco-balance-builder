
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/hooks/use-report-context';
import { supabase } from '@/integrations/supabase/client';

interface WasteFormData {
  waste_description: string;
  total_waste: number | null;
  recycled_waste: number | null;
  disposal_waste: number | null;
}

interface UseWasteEntryFormProps {
  reportId: string | undefined;
  wasteType: 'hazardous' | 'non-hazardous';
  initialData?: {
    id: string;
    waste_description: string;
    total_waste: number | null;
    recycled_waste: number | null;
    disposal_waste: number | null;
  } | null;
  onSaved: () => void;
  onCancel: () => void;
}

export const useWasteEntryForm = ({
  reportId,
  wasteType,
  initialData,
  onSaved,
  onCancel
}: UseWasteEntryFormProps) => {
  const { toast } = useToast();
  const { setNeedsSaving } = useReport();
  
  const [formData, setFormData] = useState<WasteFormData>({
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

  return {
    formData,
    isValid,
    handleChange,
    handleSubmit,
    onCancel
  };
};
