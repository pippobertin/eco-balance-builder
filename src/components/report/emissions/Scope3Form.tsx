
import React from 'react';
import { PeriodType, FuelType, TransportType, WasteType, PurchaseType } from '@/lib/emissions-types';
import {
  CategorySelector,
  TransportSection,
  WasteSection,
  PurchaseSection,
  PeriodSelector
} from './scope3-components';

interface Scope3FormProps {
  scope3Category: string;
  setScope3Category: (value: string) => void;
  // Transport props
  transportType: TransportType;
  setTransportType: (value: TransportType) => void;
  transportDistance: string;
  setTransportDistance: (value: string) => void;
  // Waste props
  wasteType: WasteType;
  setWasteType: (value: WasteType) => void;
  wasteQuantity: string;
  setWasteQuantity: (value: string) => void;
  // Purchase props
  purchaseType: PurchaseType;
  setPurchaseType: (value: PurchaseType) => void;
  purchaseQuantity: string;
  setPurchaseQuantity: (value: string) => void;
  purchaseDescription?: string;
  setPurchaseDescription?: (value: string) => void;
  // Common props
  periodType: PeriodType;
  setPeriodType: (value: PeriodType) => void;
  // Vehicle props
  vehicleType?: string;
  setVehicleType?: (value: string) => void;
  vehicleFuelType?: FuelType;
  setVehicleFuelType?: (value: FuelType) => void;
  vehicleEnergyClass?: string;
  setVehicleEnergyClass?: (value: string) => void;
  vehicleFuelConsumption?: string;
  setVehicleFuelConsumption?: (value: string) => void;
  vehicleFuelConsumptionUnit?: string;
  setVehicleFuelConsumptionUnit?: (value: string) => void;
}

const Scope3Form: React.FC<Scope3FormProps> = ({
  scope3Category,
  setScope3Category,
  transportType,
  setTransportType,
  transportDistance,
  setTransportDistance,
  wasteType,
  setWasteType,
  wasteQuantity,
  setWasteQuantity,
  purchaseType,
  setPurchaseType,
  purchaseQuantity,
  setPurchaseQuantity,
  purchaseDescription = "",
  setPurchaseDescription = () => {},
  periodType,
  setPeriodType,
  vehicleType = "",
  setVehicleType = () => {},
  vehicleFuelType = "DIESEL",
  setVehicleFuelType = () => {},
  vehicleEnergyClass = "",
  setVehicleEnergyClass = () => {},
  vehicleFuelConsumption = "",
  setVehicleFuelConsumption = () => {},
  vehicleFuelConsumptionUnit = "l_100km",
  setVehicleFuelConsumptionUnit = () => {}
}) => {
  return (
    <div className="space-y-4">
      <CategorySelector 
        scope3Category={scope3Category}
        setScope3Category={setScope3Category}
      />
      
      {scope3Category === 'transport' && (
        <TransportSection 
          transportType={transportType}
          setTransportType={setTransportType}
          transportDistance={transportDistance}
          setTransportDistance={setTransportDistance}
          vehicleType={vehicleType}
          setVehicleType={setVehicleType}
          vehicleFuelType={vehicleFuelType}
          setVehicleFuelType={setVehicleFuelType}
          vehicleEnergyClass={vehicleEnergyClass}
          setVehicleEnergyClass={setVehicleEnergyClass}
          vehicleFuelConsumption={vehicleFuelConsumption}
          setVehicleFuelConsumption={setVehicleFuelConsumption}
          vehicleFuelConsumptionUnit={vehicleFuelConsumptionUnit}
          setVehicleFuelConsumptionUnit={setVehicleFuelConsumptionUnit}
        />
      )}
      
      {scope3Category === 'waste' && (
        <WasteSection 
          wasteType={wasteType}
          setWasteType={setWasteType}
          wasteQuantity={wasteQuantity}
          setWasteQuantity={setWasteQuantity}
        />
      )}
      
      {scope3Category === 'purchases' && (
        <PurchaseSection 
          purchaseType={purchaseType}
          setPurchaseType={setPurchaseType}
          purchaseQuantity={purchaseQuantity}
          setPurchaseQuantity={setPurchaseQuantity}
          purchaseDescription={purchaseDescription}
          setPurchaseDescription={setPurchaseDescription}
        />
      )}

      <PeriodSelector 
        periodType={periodType}
        setPeriodType={setPeriodType}
      />
    </div>
  );
};

export default Scope3Form;
