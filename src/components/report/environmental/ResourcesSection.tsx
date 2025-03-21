
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Recycle, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import WasteManagementTable from './resources/WasteManagementTable';

interface ResourcesSectionProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
}

const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  formValues,
  setFormValues
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Check if setFormValues is a function that accepts an event directly (for location-specific metrics)
    if (typeof setFormValues === 'function' && setFormValues.length === 1) {
      setFormValues(e);
    } else {
      // This is the standard approach for global metrics
      const { name, value } = e.target;
      (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => ({
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          [name]: value
        }
      }));
    }
  };

  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <Recycle className="mr-2 h-5 w-5 text-green-500" />
        <h3 className="text-xl font-semibold">B7 - Uso delle risorse, economia circolare e gestione dei rifiuti</h3>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 rounded-md mb-4 bg-green-100">
          <div className="flex items-start">
            <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
            <p className="text-sm text-slate-600">
              Indica come gestisci l'uso delle risorse, le pratiche di gestione dei rifiuti e se applichi i principi dell'economia circolare.
              L'economia circolare si basa su tre principi: eliminare gli sprechi e l'inquinamento, circolazione dei prodotti e dei materiali al loro massimo valore, rigenerare la natura.
            </p>
          </div>
        </div>
        
        {/* Tabella dei rifiuti */}
        <WasteManagementTable formValues={formValues} handleChange={handleChange} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <Label htmlFor="recycledContent">Contenuto riciclato nei prodotti (%)</Label>
            <p className="text-xs text-gray-500 mb-1">
              Materiale proveniente da fonti riciclate nei prodotti sul totale dei materiali utilizzati
            </p>
            <Input 
              id="recycledContent" 
              name="recycledContent" 
              type="number" 
              placeholder="0.0" 
              value={formValues.environmentalMetrics?.recycledContent || ""} 
              onChange={handleChange} 
            />
          </div>
          
          <div>
            <Label htmlFor="recyclableContent">Contenuto riciclabile nei prodotti (%)</Label>
            <p className="text-xs text-gray-500 mb-1">
              Materiali che possono essere tecnicamente riciclati sul totale dei materiali nei prodotti
            </p>
            <Input 
              id="recyclableContent" 
              name="recyclableContent" 
              type="number" 
              placeholder="0.0" 
              value={formValues.environmentalMetrics?.recyclableContent || ""} 
              onChange={handleChange} 
            />
          </div>
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
            value={formValues.environmentalMetrics?.resourcesDetails || ""} 
            onChange={handleChange} 
            className="min-h-[120px]" 
          />
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default ResourcesSection;
