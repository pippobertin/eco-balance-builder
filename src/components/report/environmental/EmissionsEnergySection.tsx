
import React, { useState } from 'react';
import GHGEmissionsCalculator from '../GHGEmissionsCalculator';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import EmissionsResetDialog from './components/EmissionsResetDialog';
import EnergyInputsForm from './components/EnergyInputsForm';
import EmissionsSectionHeader from './components/EmissionsSectionHeader';

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

  // This handleChange function handles different form value updates
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
        <EmissionsSectionHeader />
        
        <div className="space-y-4">
          <GHGEmissionsCalculator 
            formValues={formValues} 
            setFormValues={setFormValues} 
            onResetClick={handleResetClick}
          />
          
          {/* Energy Section */}
          <EnergyInputsForm 
            formValues={formValues} 
            handleChange={handleChange} 
          />
        </div>
      </GlassmorphicCard>

      {/* Reset confirmation dialog */}
      <EmissionsResetDialog 
        showResetDialog={showResetDialog}
        setShowResetDialog={setShowResetDialog}
        resetScope={resetScope}
        setResetScope={setResetScope}
        onResetConfirm={handleResetConfirm}
      />
    </div>
  );
};

export default EmissionsEnergySection;
