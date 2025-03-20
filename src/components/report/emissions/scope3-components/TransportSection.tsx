
import React, { useEffect } from 'react';
import { TransportType, FuelType } from '@/lib/emissions-types';
import { 
  TransportTypeSelector,
  TransportDistanceInput,
  VehicleDetailsForm
} from './transport';

interface TransportSectionProps {
  transportType: TransportType;
  setTransportType: (value: TransportType) => void;
  transportDistance: string;
  setTransportDistance: (value: string) => void;
  vehicleType: string;
  setVehicleType: (value: string) => void;
  vehicleFuelType: FuelType;
  setVehicleFuelType: (value: FuelType) => void;
  vehicleEnergyClass: string;
  setVehicleEnergyClass: (value: string) => void;
  vehicleFuelConsumption?: string;
  setVehicleFuelConsumption?: (value: string) => void;
  vehicleFuelConsumptionUnit?: string;
  setVehicleFuelConsumptionUnit?: (value: string) => void;
}

const TransportSection: React.FC<TransportSectionProps> = ({
  transportType,
  setTransportType,
  transportDistance,
  setTransportDistance,
  vehicleType,
  setVehicleType,
  vehicleFuelType,
  setVehicleFuelType,
  vehicleEnergyClass,
  setVehicleEnergyClass,
  vehicleFuelConsumption = "",
  setVehicleFuelConsumption = () => {},
  vehicleFuelConsumptionUnit = "l_100km",
  setVehicleFuelConsumptionUnit = () => {}
}) => {
  // Check if we're in a transport category that requires vehicle details
  const showVehicleDetails = transportType === 'FREIGHT_ROAD' || transportType === 'BUSINESS_TRAVEL_CAR';
  
  // Set default values if transport type changes
  useEffect(() => {
    if (showVehicleDetails && !vehicleType) {
      if (transportType === 'BUSINESS_TRAVEL_CAR') {
        setVehicleType('car_medium');
      } else if (transportType === 'FREIGHT_ROAD') {
        setVehicleType('truck_medium');
      }
      
      if (!vehicleEnergyClass) {
        setVehicleEnergyClass('euro6');
      }
      
      if (!vehicleFuelType) {
        setVehicleFuelType('DIESEL');
      }
      
      if (!vehicleFuelConsumptionUnit) {
        setVehicleFuelConsumptionUnit('l_100km');
      }
    }
  }, [transportType, showVehicleDetails, vehicleType, vehicleEnergyClass, vehicleFuelType, vehicleFuelConsumptionUnit, setVehicleType, setVehicleEnergyClass, setVehicleFuelType, setVehicleFuelConsumptionUnit]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TransportTypeSelector 
          transportType={transportType}
          setTransportType={setTransportType}
        />
        
        <TransportDistanceInput
          transportDistance={transportDistance}
          setTransportDistance={setTransportDistance}
        />
      </div>
      
      {showVehicleDetails && (
        <VehicleDetailsForm
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
    </div>
  );
};

export default TransportSection;
