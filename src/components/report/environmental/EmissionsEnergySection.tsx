
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Factory, BatteryCharging, Info, RefreshCcw } from 'lucide-react';
import GHGEmissionsCalculator from '../GHGEmissionsCalculator';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EmissionsEnergySectionProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void);
}

const EmissionsEnergySection: React.FC<EmissionsEnergySectionProps> = ({
  formValues,
  setFormValues
}) => {
  // State for reset dialog
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetScope, setResetScope] = useState<'current' | 'all'>('current');

  // This handleChange function needs to be modified to better handle different form value updates
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

  // Handle reset button click
  const handleResetClick = () => {
    setShowResetDialog(true);
  };

  // Handle reset confirmation
  const handleResetConfirm = () => {
    // Create a synthetic event for resetting emissions data
    const resetEvent = {
      target: {
        name: 'resetEmissions',
        value: resetScope
      }
    } as React.ChangeEvent<HTMLInputElement>;

    // Call setFormValues with the synthetic event
    if (typeof setFormValues === 'function' && setFormValues.length === 1) {
      setFormValues(resetEvent);
    } else {
      // For the global form handler, directly update the state
      (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => {
        const updatedMetrics = { ...prev.environmentalMetrics };
        
        // Reset emissions-related fields
        updatedMetrics.totalScope1Emissions = "0";
        updatedMetrics.totalScope2Emissions = "0";
        updatedMetrics.totalScope3Emissions = "0";
        updatedMetrics.totalScopeEmissions = "0";
        updatedMetrics.scope1CalculationDetails = "";
        updatedMetrics.scope2CalculationDetails = "";
        updatedMetrics.scope3CalculationDetails = "";
        
        // If resetting all, also reset energy fields
        if (resetScope === 'all') {
          updatedMetrics.energyConsumption = "";
          updatedMetrics.fossilFuelEnergy = "";
          updatedMetrics.renewableEnergy = "";
          updatedMetrics.energyEmissionsDetails = "";
          
          // If there are location metrics, reset those as well
          if (prev.environmentalMetrics.locationMetrics) {
            updatedMetrics.locationMetrics = prev.environmentalMetrics.locationMetrics.map((loc: any) => {
              if (loc.metrics) {
                return {
                  ...loc,
                  metrics: {
                    ...loc.metrics,
                    totalScope1Emissions: "0",
                    totalScope2Emissions: "0",
                    totalScope3Emissions: "0",
                    totalScopeEmissions: "0",
                    scope1CalculationDetails: "",
                    scope2CalculationDetails: "",
                    scope3CalculationDetails: "",
                    energyConsumption: "",
                    fossilFuelEnergy: "",
                    renewableEnergy: "",
                    energyEmissionsDetails: ""
                  }
                };
              }
              return loc;
            });
          }
        }
        
        return {
          ...prev,
          environmentalMetrics: updatedMetrics
        };
      });
    }
    
    setShowResetDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Gas a effetto serra */}
      <GlassmorphicCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Factory className="mr-2 h-5 w-5 text-red-500" />
            <h3 className="text-xl font-semibold">B3 - Emissioni di gas a effetto serra (GHG) e Energia</h3>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 rounded-md mb-4 bg-red-200">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
              <p className="text-sm text-slate-600">
                Le emissioni di gas serra (GHG) sono espresse in tonnellate di CO2 equivalente (CO2e).
                L'energia è espressa in megawattora (MWh).
              </p>
            </div>
          </div>

          <GHGEmissionsCalculator 
            formValues={formValues} 
            setFormValues={setFormValues} 
            onResetClick={handleResetClick}
          />
          
          {/* Energy Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="energyConsumption">Consumo energetico totale (MWh)</Label>
              <Input 
                id="energyConsumption" 
                name="energyConsumption" 
                type="number" 
                placeholder="0.0" 
                value={formValues.environmentalMetrics?.energyConsumption || ""} 
                onChange={handleChange} 
                className="bg-white"
              />
            </div>
            
            <div>
              <Label htmlFor="fossilFuelEnergy">Energia da combustibili fossili (MWh)</Label>
              <Input 
                id="fossilFuelEnergy" 
                name="fossilFuelEnergy" 
                type="number" 
                placeholder="0.0" 
                value={formValues.environmentalMetrics?.fossilFuelEnergy || ""} 
                onChange={handleChange} 
                className="bg-white"
              />
            </div>
            
            <div>
              <Label htmlFor="renewableEnergy">Energia da fonti rinnovabili (MWh)</Label>
              <Input 
                id="renewableEnergy" 
                name="renewableEnergy" 
                type="number" 
                placeholder="0.0" 
                value={formValues.environmentalMetrics?.renewableEnergy || ""} 
                onChange={handleChange} 
                className="bg-white"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="energyEmissionsDetails">Dettagli su energia ed emissioni (opzionale)</Label>
            <Textarea 
              id="energyEmissionsDetails" 
              name="energyEmissionsDetails" 
              placeholder="Fornisci dettagli aggiuntivi su energia ed emissioni di gas serra, se applicabile." 
              value={formValues.environmentalMetrics?.energyEmissionsDetails || ""} 
              onChange={handleChange} 
              className="min-h-[120px] bg-white" 
            />
          </div>
        </div>
      </GlassmorphicCard>

      {/* Reset confirmation dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Azzera calcoli delle emissioni</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione cancellerà tutti i dati di calcolo delle emissioni.
              Vuoi procedere e applicare l'azzeramento solo alla sede corrente o a tutte le sedi?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <RadioGroup value={resetScope} onValueChange={(value) => setResetScope(value as 'current' | 'all')}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="current" id="reset-current" />
                <Label htmlFor="reset-current" className="font-normal">Solo sede corrente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="reset-all" />
                <Label htmlFor="reset-all" className="font-normal">Tutte le sedi</Label>
              </div>
            </RadioGroup>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetConfirm}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Conferma azzeramento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmissionsEnergySection;
