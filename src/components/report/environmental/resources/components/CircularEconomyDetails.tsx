
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCircularEconomyDetails } from '../hooks/useCircularEconomyDetails';
import WasteNumericField from './WasteNumericField';
import { Loader2, Save } from 'lucide-react';

interface CircularEconomyDetailsProps {
  reportId: string | undefined;
}

const CircularEconomyDetails: React.FC<CircularEconomyDetailsProps> = ({ reportId }) => {
  const { 
    details, 
    setDetails, 
    isLoading, 
    isSaving, 
    saveDetails 
  } = useCircularEconomyDetails(reportId);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'recycledContent' || name === 'recyclableContent') {
      setDetails(prev => ({
        ...prev,
        [name]: value === '' ? null : Number(value)
      }));
    } else {
      setDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSave = async () => {
    await saveDetails(details);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-lg font-medium">Dettagli Economia Circolare</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WasteNumericField
          id="recycledContent"
          name="recycledContent"
          label="Contenuto riciclato nei prodotti (%)"
          value={details.recycledContent}
          onChange={handleChange}
        />
        
        <WasteNumericField
          id="recyclableContent"
          name="recyclableContent"
          label="Contenuto riciclabile nei prodotti (%)"
          value={details.recyclableContent}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <Label htmlFor="resourcesDetails">Dettagli sull'economia circolare</Label>
        <p className="text-xs text-gray-500 mb-1">
          Descrivi se e come applichi i principi dell'economia circolare (eliminazione sprechi, riutilizzo materiali, rigenerazione ambientale)
        </p>
        <Textarea 
          id="resourcesDetails" 
          name="resourcesDetails" 
          placeholder="Descrivi le pratiche di economia circolare adottate e le strategie di gestione delle risorse" 
          value={details.resourcesDetails || ''} 
          onChange={handleChange} 
          className="min-h-[120px]" 
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvataggio...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salva dettagli
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CircularEconomyDetails;
