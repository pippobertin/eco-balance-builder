import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateCO2Emissions } from '@/lib/emissions-calculator'; 

interface GHGEmissionsCalculatorProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement>) => void);
}

const GHGEmissionsCalculator: React.FC<GHGEmissionsCalculatorProps> = ({
  formValues,
  setFormValues
}) => {
  // Function to handle changes correctly, supporting both regular and location-specific metrics
  const handleChange = (name: string, value: string) => {
    const event = {
      target: {
        name,
        value
      }
    } as React.ChangeEvent<HTMLInputElement>;

    // Check if setFormValues is a function that accepts an event directly (for location-specific metrics)
    if (typeof setFormValues === 'function' && setFormValues.length === 1) {
      setFormValues(event);
    } else {
      // This is the standard approach for global metrics
      (setFormValues as React.Dispatch<React.SetStateAction<any>>)((prev: any) => ({
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          [name]: value
        }
      }));
    }
  };

  const [scope1Data, setScope1Data] = useState({
    fuelType: '',
    quantity: '',
    unit: 'liters'
  });

  const [scope2Data, setScope2Data] = useState({
    energyType: '',
    quantity: '',
    unit: 'kWh'
  });

  const [scope3Data, setScope3Data] = useState({
    activityType: '',
    distance: '',
    transportType: ''
  });

  const handleScope1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setScope1Data(prev => ({ ...prev, [name]: value }));
  };

  const handleScope2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setScope2Data(prev => ({ ...prev, [name]: value }));
  };

  const handleScope3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setScope3Data(prev => ({ ...prev, [name]: value }));
  };

  const calculateScope1Emissions = () => {
    if (scope1Data.fuelType && scope1Data.quantity) {
      const emissions = calculateCO2Emissions(
        scope1Data.fuelType,
        parseFloat(scope1Data.quantity),
        scope1Data.unit
      );
      handleChange('totalScope1Emissions', emissions.toFixed(2));
    }
  };

  const calculateScope2Emissions = () => {
    if (scope2Data.energyType && scope2Data.quantity) {
      const emissions = calculateCO2Emissions(
        scope2Data.energyType,
        parseFloat(scope2Data.quantity),
        scope2Data.unit
      );
       handleChange('totalScope2Emissions', emissions.toFixed(2));
    }
  };

  const calculateScope3Emissions = () => {
    if (scope3Data.activityType && scope3Data.distance && scope3Data.transportType) {
      const emissions = calculateCO2Emissions(
        scope3Data.transportType,
        parseFloat(scope3Data.distance),
        'km'
      );
      handleChange('totalScope3Emissions', emissions.toFixed(2));
    }
  };

  return (
    <div>
      {/* Scope 1 Emissions */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Calcolo Emissioni Scope 1</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="fuelType">Tipo di Combustibile</Label>
            <Input
              type="text"
              id="fuelType"
              name="fuelType"
              placeholder="es. Diesel"
              value={scope1Data.fuelType}
              onChange={handleScope1Change}
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantità</Label>
            <Input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="es. 1000"
              value={scope1Data.quantity}
              onChange={handleScope1Change}
            />
          </div>
          <div>
            <Label htmlFor="unit">Unità</Label>
            <select
              id="unit"
              name="unit"
              value={scope1Data.unit}
              onChange={(e) => handleScope1Change(e)}
              className="w-full border rounded-md py-2 px-3"
            >
              <option value="liters">Litri</option>
              <option value="kg">Chilogrammi</option>
            </select>
          </div>
        </div>
        <button
          onClick={calculateScope1Emissions}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
        >
          Calcola Emissioni Scope 1
        </button>
      </div>

      {/* Scope 2 Emissions */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Calcolo Emissioni Scope 2</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="energyType">Tipo di Energia</Label>
            <Input
              type="text"
              id="energyType"
              name="energyType"
              placeholder="es. Elettricità"
              value={scope2Data.energyType}
              onChange={handleScope2Change}
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantità</Label>
            <Input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="es. 2000"
              value={scope2Data.quantity}
              onChange={handleScope2Change}
            />
          </div>
          <div>
            <Label htmlFor="unit">Unità</Label>
            <select
              id="unit"
              name="unit"
              value={scope2Data.unit}
              onChange={(e) => handleScope2Change(e)}
              className="w-full border rounded-md py-2 px-3"
            >
              <option value="kWh">kWh</option>
              <option value="MWh">MWh</option>
            </select>
          </div>
        </div>
        <button
          onClick={calculateScope2Emissions}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
        >
          Calcola Emissioni Scope 2
        </button>
      </div>

      {/* Scope 3 Emissions */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Calcolo Emissioni Scope 3</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="activityType">Tipo di Attività</Label>
            <Input
              type="text"
              id="activityType"
              name="activityType"
              placeholder="es. Trasporto merci"
              value={scope3Data.activityType}
              onChange={handleScope3Change}
            />
          </div>
          <div>
            <Label htmlFor="distance">Distanza</Label>
            <Input
              type="number"
              id="distance"
              name="distance"
              placeholder="es. 500"
              value={scope3Data.distance}
              onChange={handleScope3Change}
            />
          </div>
          <div>
            <Label htmlFor="transportType">Tipo di Trasporto</Label>
             <Input
              type="text"
              id="transportType"
              name="transportType"
              placeholder="es. Truck"
              value={scope3Data.transportType}
              onChange={handleScope3Change}
            />
          </div>
        </div>
        <button
          onClick={calculateScope3Emissions}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
        >
          Calcola Emissioni Scope 3
        </button>
      </div>
    </div>
  );
};

export default GHGEmissionsCalculator;
