import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calculator, Save } from 'lucide-react';
import { EmissionFactorSource, PeriodType } from '@/lib/emissions-types';
import { GHGEmissionsCalculatorProps } from './emissions/types';
import { useCalculator } from './emissions/hooks/useCalculator';

// Import refactored components
import Scope1Form from './emissions/Scope1Form';
import Scope2Form from './emissions/Scope2Form';
import Scope3Form from './emissions/Scope3Form';
import EmissionsResults from './emissions/EmissionsResults';
import CalculatorHeader from './emissions/CalculatorHeader';
import EmissionsCalculationTable from './emissions/EmissionsCalculationTable';
import AutoSaveIndicator from './AutoSaveIndicator';
const GHGEmissionsCalculator: React.FC<GHGEmissionsCalculatorProps> = ({
  formValues,
  setFormValues,
  onResetClick
}) => {
  const {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    inputs,
    updateInput,
    calculateEmissions,
    calculationLogs,
    handleRemoveCalculation,
    handleSubmitCalculation,
    isSaving,
    isLoadingExisting
  } = useCalculator(formValues, setFormValues, onResetClick);
  useEffect(() => {
    // Debug log to see if calculation logs are populated correctly
    console.log("GHGEmissionsCalculator: Current calculation logs:", calculationLogs);
    console.log("Scope1 calculations:", calculationLogs.scope1Calculations?.length || 0);
    console.log("Scope2 calculations:", calculationLogs.scope2Calculations?.length || 0);
    console.log("Scope3 calculations:", calculationLogs.scope3Calculations?.length || 0);
  }, [calculationLogs]);
  const getActiveTabContent = () => {
    switch (activeTab) {
      case 'scope1':
        return <Scope1Form scope1Source={inputs.scope1Source || 'fuel'} setScope1Source={value => updateInput('scope1Source', value)} fuelType={inputs.fuelType || 'DIESEL'} setFuelType={value => updateInput('fuelType', value)} fuelQuantity={inputs.fuelQuantity || ''} setFuelQuantity={value => updateInput('fuelQuantity', value)} fuelUnit={inputs.fuelUnit || 'L'} setFuelUnit={value => updateInput('fuelUnit', value)} periodType={inputs.periodType || PeriodType.ANNUAL} setPeriodType={value => updateInput('periodType', value)} />;
      case 'scope2':
        return <Scope2Form energyType={inputs.energyType || 'ELECTRICITY_IT'} setEnergyType={value => updateInput('energyType', value)} energyQuantity={inputs.energyQuantity || ''} setEnergyQuantity={value => updateInput('energyQuantity', value)} renewablePercentage={inputs.renewablePercentage || 0} setRenewablePercentage={value => updateInput('renewablePercentage', value)} periodType={inputs.periodType || PeriodType.ANNUAL} setPeriodType={value => updateInput('periodType', value)} />;
      case 'scope3':
        return <Scope3Form scope3Category={inputs.scope3Category || 'transport'} setScope3Category={value => updateInput('scope3Category', value)} transportType={inputs.transportType || 'BUSINESS_TRAVEL_CAR'} setTransportType={value => updateInput('transportType', value)} transportDistance={inputs.transportDistance || ''} setTransportDistance={value => updateInput('transportDistance', value)} wasteType={inputs.wasteType || 'WASTE_LANDFILL'} setWasteType={value => updateInput('wasteType', value)} wasteQuantity={inputs.wasteQuantity || ''} setWasteQuantity={value => updateInput('wasteQuantity', value)} purchaseType={inputs.purchaseType || 'PURCHASED_GOODS'} setPurchaseType={value => updateInput('purchaseType', value)} purchaseQuantity={inputs.purchaseQuantity || ''} setPurchaseQuantity={value => updateInput('purchaseQuantity', value)} periodType={inputs.periodType || PeriodType.ANNUAL} setPeriodType={value => updateInput('periodType', value)} />;
      default:
        return null;
    }
  };

  // Handle calculate button click - this calculates for current tab only
  const handleCalculateClick = () => {
    console.log('Calculate button clicked for tab:', activeTab);
    calculateEmissions(activeTab as 'scope1' | 'scope2' | 'scope3');
  };

  // Handle save button click - this saves to database
  const handleSaveClick = () => {
    console.log('Save button clicked');
    handleSubmitCalculation();
  };

  // Check if we have any calculation logs to display
  const hasCalculationLogs = calculationLogs && (Array.isArray(calculationLogs.scope1Calculations) && calculationLogs.scope1Calculations.length > 0 || Array.isArray(calculationLogs.scope2Calculations) && calculationLogs.scope2Calculations.length > 0 || Array.isArray(calculationLogs.scope3Calculations) && calculationLogs.scope3Calculations.length > 0);
  if (isLoadingExisting) {
    return <div className="border rounded-md p-4 bg-white/80">
        <div className="flex justify-center py-8">
          <p className="text-gray-500">Caricamento dati delle emissioni...</p>
        </div>
      </div>;
  }
  return <div className="border rounded-md p-4 bg-white/80">
      <CalculatorHeader calculationMethod={inputs.calculationMethod || EmissionFactorSource.DEFRA} setCalculationMethod={value => updateInput('calculationMethod', value)} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="scope1">Scope 1 - Emissioni Dirette</TabsTrigger>
          <TabsTrigger value="scope2">Scope 2 - Energia</TabsTrigger>
          <TabsTrigger value="scope3">Scope 3 - Altre Emissioni</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {getActiveTabContent()}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between items-center">
        <div className="space-x-2">
          <Button onClick={handleCalculateClick} className="flex items-center">
            <Calculator className="mr-2 h-4 w-4" />
            Calcola Emissioni
          </Button>
          
          <Button onClick={handleSaveClick} disabled={isSaving} variant="outline" className="flex items-center text-center my-[10px] bg-emerald-500 hover:bg-emerald-400 text-stone-50">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Salvando...' : 'Salva Emissioni'}
          </Button>
        </div>
        
        <EmissionsResults calculatedEmissions={calculatedEmissions} />
      </div>
      
      {/* Tabelle di riepilogo per ogni scope */}
      <div className="mt-8 space-y-6">
        <h3 className="text-lg font-semibold mb-4">Riepilogo calcoli emissioni</h3>
        
        {!hasCalculationLogs && <p className="text-gray-500 text-sm">Nessun calcolo effettuato. Utilizzare il calcolatore per aggiungere emissioni.</p>}
        
        {calculationLogs && calculationLogs.scope1Calculations && calculationLogs.scope1Calculations.length > 0 && <EmissionsCalculationTable scope="scope1" scopeLabel="Scope 1 - Emissioni Dirette" calculations={calculationLogs.scope1Calculations} onRemoveCalculation={handleRemoveCalculation} />}
        
        {calculationLogs && calculationLogs.scope2Calculations && calculationLogs.scope2Calculations.length > 0 && <EmissionsCalculationTable scope="scope2" scopeLabel="Scope 2 - Energia" calculations={calculationLogs.scope2Calculations} onRemoveCalculation={handleRemoveCalculation} />}
        
        {calculationLogs && calculationLogs.scope3Calculations && calculationLogs.scope3Calculations.length > 0 && <EmissionsCalculationTable scope="scope3" scopeLabel="Scope 3 - Altre Emissioni" calculations={calculationLogs.scope3Calculations} onRemoveCalculation={handleRemoveCalculation} />}
      </div>
    </div>;
};
export default GHGEmissionsCalculator;