
import React, { useEffect } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { PeriodType, FuelType, EnergyType, TransportType, WasteType, PurchaseType } from '@/lib/emissions-types';
import Scope1Form from '../Scope1Form';
import Scope2Form from '../Scope2Form';
import Scope3Form from '../Scope3Form';

interface CalculationTabsContentProps {
  activeTab: string;
  inputs: any;
  updateInput: (key: string, value: any) => void;
}

const CalculationTabsContent: React.FC<CalculationTabsContentProps> = ({
  activeTab,
  inputs,
  updateInput
}) => {
  // Debug inputs for specific fields to help diagnose issues
  useEffect(() => {
    console.log("Current inputs in CalculationTabsContent:", {
      fuelQuantity: inputs.fuelQuantity,
      energyQuantity: inputs.energyQuantity,
      transportDistance: inputs.transportDistance,
      wasteQuantity: inputs.wasteQuantity,
      purchaseQuantity: inputs.purchaseQuantity,
    });
  }, [inputs]);

  const getActiveTabContent = () => {
    switch (activeTab) {
      case 'scope1':
        return <Scope1Form 
                 scope1Source={typeof inputs.scope1Source === 'string' ? inputs.scope1Source : 'fuel'} 
                 setScope1Source={value => updateInput('scope1Source', value)} 
                 fuelType={typeof inputs.fuelType === 'string' ? inputs.fuelType as FuelType : 'DIESEL'} 
                 setFuelType={value => updateInput('fuelType', value)} 
                 fuelQuantity={inputs.fuelQuantity || ''} 
                 setFuelQuantity={value => updateInput('fuelQuantity', value)} 
                 fuelUnit={typeof inputs.fuelUnit === 'string' ? inputs.fuelUnit : 'L'} 
                 setFuelUnit={value => updateInput('fuelUnit', value)} 
                 periodType={typeof inputs.periodType === 'string' ? inputs.periodType as PeriodType : PeriodType.ANNUAL} 
                 setPeriodType={value => updateInput('periodType', value)} />;
      case 'scope2':
        return <Scope2Form 
                 energyType={typeof inputs.energyType === 'string' ? inputs.energyType as EnergyType : 'ELECTRICITY_IT'} 
                 setEnergyType={value => updateInput('energyType', value)} 
                 energyQuantity={inputs.energyQuantity || ''} 
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
                 transportDistance={inputs.transportDistance || ''} 
                 setTransportDistance={value => updateInput('transportDistance', value)} 
                 wasteType={typeof inputs.wasteType === 'string' ? inputs.wasteType as WasteType : 'WASTE_LANDFILL'} 
                 setWasteType={value => updateInput('wasteType', value)} 
                 wasteQuantity={inputs.wasteQuantity || ''} 
                 setWasteQuantity={value => updateInput('wasteQuantity', value)} 
                 purchaseType={typeof inputs.purchaseType === 'string' ? inputs.purchaseType as PurchaseType : 'PURCHASED_GOODS'} 
                 setPurchaseType={value => updateInput('purchaseType', value)} 
                 purchaseQuantity={inputs.purchaseQuantity || ''} 
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
                 vehicleFuelConsumption={inputs.vehicleFuelConsumption || ''}
                 setVehicleFuelConsumption={value => updateInput('vehicleFuelConsumption', value)}
                 vehicleFuelConsumptionUnit={typeof inputs.vehicleFuelConsumptionUnit === 'string' ? inputs.vehicleFuelConsumptionUnit : 'l_100km'}
                 setVehicleFuelConsumptionUnit={value => updateInput('vehicleFuelConsumptionUnit', value)}
                 />;
      default:
        return null;
    }
  };

  return (
    <TabsContent value={activeTab} className="space-y-4">
      {getActiveTabContent()}
    </TabsContent>
  );
};

export default CalculationTabsContent;
