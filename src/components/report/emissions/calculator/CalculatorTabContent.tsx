
import React from 'react';
import Scope1Form from '../Scope1Form';
import Scope2Form from '../Scope2Form';
import Scope3Form from '../Scope3Form';
import { FuelType, PeriodType, EnergyType, TransportType, WasteType, PurchaseType } from '@/lib/emissions-types';

interface CalculatorTabContentProps {
  activeTab: string;
  inputs: any;
  updateInput: (name: string, value: any) => void;
}

const CalculatorTabContent: React.FC<CalculatorTabContentProps> = ({
  activeTab,
  inputs,
  updateInput
}) => {
  switch (activeTab) {
    case 'scope1':
      return (
        <Scope1Form 
          scope1Source={typeof inputs.scope1Source === 'string' ? inputs.scope1Source : 'fuel'} 
          setScope1Source={value => updateInput('scope1Source', value)} 
          fuelType={typeof inputs.fuelType === 'string' ? inputs.fuelType as FuelType : 'DIESEL'} 
          setFuelType={value => updateInput('fuelType', value)} 
          fuelQuantity={typeof inputs.fuelQuantity === 'string' ? inputs.fuelQuantity : ''} 
          setFuelQuantity={value => updateInput('fuelQuantity', value)} 
          fuelUnit={typeof inputs.fuelUnit === 'string' ? inputs.fuelUnit : 'L'} 
          setFuelUnit={value => updateInput('fuelUnit', value)} 
          periodType={typeof inputs.periodType === 'string' ? inputs.periodType as PeriodType : PeriodType.ANNUAL} 
          setPeriodType={value => updateInput('periodType', value)} 
        />
      );
    case 'scope2':
      return (
        <Scope2Form 
          energyType={typeof inputs.energyType === 'string' ? inputs.energyType as EnergyType : 'ELECTRICITY_IT'} 
          setEnergyType={value => updateInput('energyType', value)} 
          energyQuantity={typeof inputs.energyQuantity === 'string' ? inputs.energyQuantity : ''} 
          setEnergyQuantity={value => updateInput('energyQuantity', value)} 
          renewablePercentage={typeof inputs.renewablePercentage === 'number' ? inputs.renewablePercentage : 0} 
          setRenewablePercentage={value => updateInput('renewablePercentage', value)} 
          periodType={typeof inputs.periodType === 'string' ? inputs.periodType as PeriodType : PeriodType.ANNUAL} 
          setPeriodType={value => updateInput('periodType', value)}
          energyProvider={typeof inputs.energyProvider === 'string' ? inputs.energyProvider : ''}
          setEnergyProvider={value => updateInput('energyProvider', value)} 
        />
      );
    case 'scope3':
      return (
        <Scope3Form 
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
        />
      );
    default:
      return null;
  }
};

export default CalculatorTabContent;
