
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calculator, Save } from 'lucide-react';
import { EmissionFactorSource, PeriodType, FuelType, EnergyType, TransportType, WasteType, PurchaseType } from '@/lib/emissions-types';
import { GHGEmissionsCalculatorProps } from './emissions/types';
import { useCalculator } from './emissions/hooks/useCalculator';
import { useReport } from '@/hooks/use-report-context';

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
  const { currentReport } = useReport();
  const reportId = currentReport?.id || formValues?.reportId;
  
  // Use a ref to track if we've already logged initial information
  const hasLoggedInitialInfo = React.useRef(false);
  
  useEffect(() => {
    // Only log this information once when the component mounts, not on every render
    if (!hasLoggedInitialInfo.current) {
      console.log('GHGEmissionsCalculator: Current reportId:', reportId);
      console.log('GHGEmissionsCalculator: formValues:', formValues);
      hasLoggedInitialInfo.current = true;
    }
  }, [reportId, formValues]);
  
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
  } = useCalculator(
    { ...formValues, reportId },
    setFormValues, 
    onResetClick
  );

  // Only log calculation logs when they actually change, not on every render
  const calculationLogCountRef = React.useRef({
    scope1: 0,
    scope2: 0,
    scope3: 0
  });
  
  useEffect(() => {
    const newCounts = {
      scope1: calculationLogs.scope1Calculations?.length || 0,
      scope2: calculationLogs.scope2Calculations?.length || 0,
      scope3: calculationLogs.scope3Calculations?.length || 0
    };
    
    // Only log if the counts have changed
    if (newCounts.scope1 !== calculationLogCountRef.current.scope1 ||
        newCounts.scope2 !== calculationLogCountRef.current.scope2 ||
        newCounts.scope3 !== calculationLogCountRef.current.scope3) {
        
      console.log("GHGEmissionsCalculator: Current calculation logs:", calculationLogs);
      console.log("Scope1 calculations:", calculationLogs.scope1Calculations?.length || 0);
      console.log("Scope2 calculations:", calculationLogs.scope2Calculations?.length || 0);
      console.log("Scope3 calculations:", calculationLogs.scope3Calculations?.length || 0);
      
      // Update the ref with new counts
      calculationLogCountRef.current = newCounts;
    }
  }, [calculationLogs]);

  const getActiveTabContent = () => {
    switch (activeTab) {
      case 'scope1':
        return <Scope1Form 
                 scope1Source={typeof inputs.scope1Source === 'string' ? inputs.scope1Source : 'fuel'} 
                 setScope1Source={value => updateInput('scope1Source', value)} 
                 fuelType={typeof inputs.fuelType === 'string' ? inputs.fuelType as FuelType : 'DIESEL'} 
                 setFuelType={value => updateInput('fuelType', value)} 
                 fuelQuantity={typeof inputs.fuelQuantity === 'string' ? inputs.fuelQuantity : ''} 
                 setFuelQuantity={value => updateInput('fuelQuantity', value)} 
                 fuelUnit={typeof inputs.fuelUnit === 'string' ? inputs.fuelUnit : 'L'} 
                 setFuelUnit={value => updateInput('fuelUnit', value)} 
                 periodType={typeof inputs.periodType === 'string' ? inputs.periodType as PeriodType : PeriodType.ANNUAL} 
                 setPeriodType={value => updateInput('periodType', value)} />;
      case 'scope2':
        return <Scope2Form 
                 energyType={typeof inputs.energyType === 'string' ? inputs.energyType as EnergyType : 'ELECTRICITY_IT'} 
                 setEnergyType={value => updateInput('energyType', value)} 
                 energyQuantity={typeof inputs.energyQuantity === 'string' ? inputs.energyQuantity : ''} 
                 setEnergyQuantity={value => updateInput('energyQuantity', value)} 
                 renewablePercentage={typeof inputs.renewablePercentage === 'number' ? inputs.renewablePercentage : 0} 
                 setRenewablePercentage={value => updateInput('renewablePercentage', value)} 
                 periodType={typeof inputs.periodType === 'string' ? inputs.periodType as PeriodType : PeriodType.ANNUAL} 
                 setPeriodType={value => updateInput('periodType', value)}
                 energyProvider={typeof inputs.energyProvider === 'string' ? inputs.energyProvider : ''}
                 setEnergyProvider={value => updateInput('energyProvider', value)} />;
      case 'scope3':
        return <Scope3Form 
                 scope3Category={typeof inputs.scope3Category === 'string' ? inputs.scope3Category : 'transport'} 
                 setScope3Category={value => updateInput('scope3Category', value)} 
                 transportType={typeof inputs.transportType === 'string' ? inputs.transportType as TransportType : 'BUSINESS_TRAVEL_CAR'} 
                 setTransportType={value => updateInput('transportType', value)} 
                 transportDistance={typeof inputs.transportDistance === 'string' ? inputs.transportDistance : ''} 
                 setTransportDistance={value => updateInput('transportDistance', value)} 
                 wasteType={typeof inputs.wasteType === 'string' ? inputs.wasteType as WasteType : 'WASTE_LANDFILL'} 
                 setWasteType={value => updateInput('wasteType', value)} 
                 wasteQuantity={typeof inputs.wasteQuantity === 'string' ? inputs.wasteQuantity : ''} 
                 setWasteQuantity={value => updateInput('wasteQuantity', value)} 
                 purchaseType={typeof inputs.purchaseType === 'string' ? inputs.purchaseType as PurchaseType : 'PURCHASED_GOODS'} 
                 setPurchaseType={value => updateInput('purchaseType', value)} 
                 purchaseQuantity={typeof inputs.purchaseQuantity === 'string' ? inputs.purchaseQuantity : ''} 
                 setPurchaseQuantity={value => updateInput('purchaseQuantity', value)}
                 purchaseDescription={typeof inputs.purchaseDescription === 'string' ? inputs.purchaseDescription : ''}
                 setPurchaseDescription={value => updateInput('purchaseDescription', value)}
                 periodType={typeof inputs.periodType === 'string' ? inputs.periodType as PeriodType : PeriodType.ANNUAL} 
                 setPeriodType={value => updateInput('periodType', value)}
                 vehicleType={typeof inputs.vehicleType === 'string' ? inputs.vehicleType : ''}
                 setVehicleType={value => updateInput('vehicleType', value)}
                 vehicleFuelType={typeof inputs.vehicleFuelType === 'string' ? inputs.vehicleFuelType as FuelType : 'DIESEL'}
                 setVehicleFuelType={value => updateInput('vehicleFuelType', value)}
                 vehicleEnergyClass={typeof inputs.vehicleEnergyClass === 'string' ? inputs.vehicleEnergyClass : ''}
                 setVehicleEnergyClass={value => updateInput('vehicleEnergyClass', value)}
                 vehicleFuelConsumption={typeof inputs.vehicleFuelConsumption === 'string' ? inputs.vehicleFuelConsumption : ''}
                 setVehicleFuelConsumption={value => updateInput('vehicleFuelConsumption', value)}
                 vehicleFuelConsumptionUnit={typeof inputs.vehicleFuelConsumptionUnit === 'string' ? inputs.vehicleFuelConsumptionUnit : 'l_100km'}
                 setVehicleFuelConsumptionUnit={value => updateInput('vehicleFuelConsumptionUnit', value)}
                 />;
      default:
        return null;
    }
  };

  const handleCalculateClick = () => {
    console.log('Calculate button clicked for tab:', activeTab);
    console.log('Using reportId for calculation:', reportId);
    calculateEmissions(activeTab as 'scope1' | 'scope2' | 'scope3');
  };

  const handleSaveClick = () => {
    console.log('Save button clicked with reportId:', reportId);
    handleSubmitCalculation();
  };

  const hasCalculationLogs = calculationLogs && (Array.isArray(calculationLogs.scope1Calculations) && calculationLogs.scope1Calculations.length > 0 || Array.isArray(calculationLogs.scope2Calculations) && calculationLogs.scope2Calculations.length > 0 || Array.isArray(calculationLogs.scope3Calculations) && calculationLogs.scope3Calculations.length > 0);

  if (isLoadingExisting) {
    return <div className="border rounded-md p-4 bg-white/80">
        <div className="flex justify-center py-8">
          <p className="text-gray-500">Caricamento dati delle emissioni...</p>
        </div>
      </div>;
  }

  return <div className="border rounded-md p-4 bg-white/80">
      <CalculatorHeader calculationMethod={typeof inputs.calculationMethod === 'string' ? inputs.calculationMethod as EmissionFactorSource : EmissionFactorSource.DEFRA} setCalculationMethod={value => updateInput('calculationMethod', value)} />
      
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
      
      <div className="mt-8 space-y-6">
        <h3 className="text-lg font-semibold mb-4">Riepilogo calcoli emissioni</h3>
        
        {(!calculationLogs || 
         (!calculationLogs.scope1Calculations?.length && 
          !calculationLogs.scope2Calculations?.length && 
          !calculationLogs.scope3Calculations?.length)) && 
         <p className="text-gray-500 text-sm">Nessun calcolo effettuato. Utilizzare il calcolatore per aggiungere emissioni.</p>}
        
        {calculationLogs?.scope1Calculations && calculationLogs.scope1Calculations.length > 0 && 
         <EmissionsCalculationTable scope="scope1" scopeLabel="Scope 1 - Emissioni Dirette" calculations={calculationLogs.scope1Calculations} onRemoveCalculation={handleRemoveCalculation} />}
        
        {calculationLogs?.scope2Calculations && calculationLogs.scope2Calculations.length > 0 && 
         <EmissionsCalculationTable scope="scope2" scopeLabel="Scope 2 - Energia" calculations={calculationLogs.scope2Calculations} onRemoveCalculation={handleRemoveCalculation} />}
        
        {calculationLogs?.scope3Calculations && calculationLogs.scope3Calculations.length > 0 && 
         <EmissionsCalculationTable scope="scope3" scopeLabel="Scope 3 - Altre Emissioni" calculations={calculationLogs.scope3Calculations} onRemoveCalculation={handleRemoveCalculation} />}
      </div>
    </div>;
};

export default GHGEmissionsCalculator;
