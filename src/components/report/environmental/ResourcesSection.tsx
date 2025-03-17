
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Recycle, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

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
              I rifiuti sono espressi in kg o tonnellate.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="totalWaste">Produzione totale di rifiuti (tonnellate)</Label>
            <Input 
              id="totalWaste" 
              name="totalWaste" 
              type="number" 
              placeholder="0.0" 
              value={formValues.environmentalMetrics?.totalWaste || ""} 
              onChange={handleChange} 
            />
          </div>
          
          <div>
            <Label htmlFor="recycledWaste">Rifiuti destinati al riciclo o riutilizzo (tonnellate)</Label>
            <Input 
              id="recycledWaste" 
              name="recycledWaste" 
              type="number" 
              placeholder="0.0" 
              value={formValues.environmentalMetrics?.recycledWaste || ""} 
              onChange={handleChange} 
            />
          </div>
          
          <div>
            <Label htmlFor="hazardousWaste">Rifiuti pericolosi (tonnellate)</Label>
            <Input 
              id="hazardousWaste" 
              name="hazardousWaste" 
              type="number" 
              placeholder="0.0" 
              value={formValues.environmentalMetrics?.hazardousWaste || ""} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recycledContent">Contenuto riciclato nei prodotti (%)</Label>
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
          <Label htmlFor="resourcesDetails">Dettagli sull'economia circolare (opzionale)</Label>
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
