
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Leaf, Info } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface BiodiversitySectionProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
}

const BiodiversitySection: React.FC<BiodiversitySectionProps> = ({
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
        <Leaf className="mr-2 h-5 w-5 text-emerald-500" />
        <h3 className="text-xl font-semibold">B5 - Biodiversità e ecosistemi</h3>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 rounded-md mb-4 bg-emerald-100">
          <div className="flex items-start">
            <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
            <p className="text-sm text-slate-600">
              Indica i dati relativi agli impatti sulla biodiversità, sugli ecosistemi e sull'uso del suolo. I dati sono espressi in ettari (ha).
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="landUse">Uso totale del suolo (ettari)</Label>
            <Input 
              id="landUse" 
              name="landUse" 
              type="number" 
              placeholder="0.0" 
              value={formValues.environmentalMetrics?.landUse || ""} 
              onChange={handleChange} 
            />
          </div>
          
          <div>
            <Label htmlFor="impermeableSurface">Superficie impermeabilizzata (ettari)</Label>
            <Input 
              id="impermeableSurface" 
              name="impermeableSurface" 
              type="number" 
              placeholder="0.0" 
              value={formValues.environmentalMetrics?.impermeableSurface || ""} 
              onChange={handleChange} 
            />
          </div>
          
          <div>
            <Label htmlFor="natureSurfaceOnSite">Superficie orientata alla natura in sito (ettari)</Label>
            <Input 
              id="natureSurfaceOnSite" 
              name="natureSurfaceOnSite" 
              type="number" 
              placeholder="0.0" 
              value={formValues.environmentalMetrics?.natureSurfaceOnSite || ""} 
              onChange={handleChange} 
            />
          </div>
          
          <div>
            <Label htmlFor="natureSurfaceOffSite">Superficie orientata alla natura fuori sito (ettari)</Label>
            <Input 
              id="natureSurfaceOffSite" 
              name="natureSurfaceOffSite" 
              type="number" 
              placeholder="0.0" 
              value={formValues.environmentalMetrics?.natureSurfaceOffSite || ""} 
              onChange={handleChange} 
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="biodiversityDetails">Numero e area (ettari) dei siti in prossimità di aree sensibili</Label>
          <Textarea 
            id="biodiversityDetails" 
            name="biodiversityDetails" 
            placeholder="Descrivi i siti di proprietà, affittati o gestiti all'interno o in prossimità di aree sensibili sotto il profilo della biodiversità" 
            value={formValues.environmentalMetrics?.biodiversityDetails || ""} 
            onChange={handleChange} 
            className="min-h-[120px]" 
          />
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default BiodiversitySection;
