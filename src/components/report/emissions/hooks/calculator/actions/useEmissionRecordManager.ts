import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmissionCalculationRecord } from "@/lib/supabase/db.types";
import { createEmissionCalculation, deleteEmissionCalculation, updateEmissionCalculation } from "@/lib/supabase/queries";
import { useReport } from "@/hooks/use-report-context";
import { PeriodType, FuelType, EnergyType, TransportType, WasteType, PurchaseType } from '@/lib/emissions-types';

// Define types for the details object based on the scope
type Scope1Details = {
  periodType: PeriodType;
  scope1Source: 'fuel';
  fuelType: FuelType;
  quantity: number;
  unit: string;
};

type Scope2Details = {
  periodType: PeriodType;
  energyType: EnergyType;
  quantity: number;
  renewablePercentage: number;
  energyProvider: string;
};

type Scope3Details = {
  periodType: PeriodType;
  scope3Category: 'transport' | 'waste' | 'purchases';
  transportType: TransportType;
  transportDistance: number;
  wasteType: WasteType;
  wasteQuantity: number;
  purchaseType: PurchaseType;
  purchaseQuantity: number;
  purchaseDescription: string;
  vehicleType: string;
  vehicleFuelType: FuelType;
  vehicleEnergyClass: string;
  vehicleFuelConsumption: number;
  vehicleFuelConsumptionUnit: string;
};

type EmissionDetails = Scope1Details | Scope2Details | Scope3Details;

export const useEmissionRecordManager = () => {
  const queryClient = useQueryClient();
  const { currentReport } = useReport();
  const reportId = currentReport?.id;

  const { mutate: newCalculation, isPending: isCreating } = useMutation({
    mutationFn: async (emissionCalculation: EmissionCalculationRecord) => {
      if (!reportId) {
        throw new Error("Report ID is missing.");
      }
      return createEmissionCalculation({ ...emissionCalculation, report_id: reportId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['emission-calculations', reportId],
      });
      toast.success('Emission calculation created successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to create emission calculation: ${error.message}`);
    },
  });

  const { mutate: removeCalculation, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      return deleteEmissionCalculation(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['emission-calculations', reportId],
      });
      toast.success('Emission calculation deleted successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to delete emission calculation: ${error.message}`);
    },
  });

  const { mutate: editCalculation, isPending: isUpdating } = useMutation({
    mutationFn: async (emissionCalculation: EmissionCalculationRecord) => {
      return updateEmissionCalculation(emissionCalculation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['emission-calculations', reportId],
      });
      toast.success('Emission calculation updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update emission calculation: ${error.message}`);
    },
  });

  const createNewCalculation = async (
    scope: 'scope1' | 'scope2' | 'scope3',
    source: string,
    description: string,
    quantity: string,
    unit: string,
    emissions: number,
    details: EmissionDetails
  ) => {
    if (!reportId) {
      throw new Error("Report ID is missing.");
    }

    const quantityToSave = Number(quantity);
    const emissionsToSave = Number(emissions);

    if (isNaN(quantityToSave) || isNaN(emissionsToSave)) {
      toast.error("Please enter valid numeric values for quantity and emissions.");
      return;
    }

    const newCalculationData: EmissionCalculationRecord = {
      report_id: reportId,
      scope: scope,
      source: source,
      description: description,
      quantity: quantityToSave,
      unit: unit,
      emissions: emissionsToSave,
      details: details,
      date: new Date().toISOString()
    };

    newCalculation(newCalculationData);
  };

  const updateCalculation = async (calculationId: string, scope: 'scope1' | 'scope2' | 'scope3') => {
    if (!reportId) {
      throw new Error("Report ID is missing.");
    }

    // Retrieve input values from the form or component state
    // Replace these with your actual input fields
    const source = 'Fuel Consumption'; // Example source
    const description = 'Updated Fuel Consumption Calculation'; // Example description
    const quantity = '1500'; // Example quantity
    const unit = 'L'; // Example unit
    const emissions = 3.8; // Example emissions

    // Retrieve details based on the scope
    let detailsToSave: EmissionDetails = {
      periodType: PeriodType.ANNUAL,
    } as EmissionDetails;

    if (scope === 'scope1') {
      detailsToSave = {
        periodType: PeriodType.ANNUAL,
        scope1Source: 'fuel',
        fuelType: FuelType.DIESEL,
        quantity: 1500,
        unit: 'L',
      };
    } else if (scope === 'scope2') {
      detailsToSave = {
        periodType: PeriodType.ANNUAL,
        energyType: EnergyType.ELECTRICITY_IT,
        quantity: 5000,
        renewablePercentage: 10,
        energyProvider: 'Enel',
      };
    } else if (scope === 'scope3') {
      detailsToSave = {
        periodType: PeriodType.ANNUAL,
        scope3Category: 'transport',
        transportType: TransportType.BUSINESS_TRAVEL_CAR,
        transportDistance: 200,
        wasteType: WasteType.WASTE_LANDFILL,
        wasteQuantity: 100,
        purchaseType: PurchaseType.PURCHASED_GOODS,
        purchaseQuantity: 50,
        purchaseDescription: 'Office Supplies',
        vehicleType: 'Car',
        vehicleFuelType: FuelType.DIESEL,
        vehicleEnergyClass: 'A',
        vehicleFuelConsumption: 7.5,
        vehicleFuelConsumptionUnit: 'l_100km',
      };
    }

    const quantityToSave = Number(quantity);
    const emissionsToSave = Number(emissions);

    if (isNaN(quantityToSave) || isNaN(emissionsToSave)) {
      toast.error("Please enter valid numeric values for quantity and emissions.");
      return;
    }

    // Costruzione dell'oggetto di aggiornamento, aggiungendo il campo date
    const updatedCalculation: EmissionCalculationRecord = {
      id: calculationId,
      report_id: reportId || '',
      scope: scope,
      source: source,
      description: description,
      quantity: Number(quantity),
      unit: unit,
      emissions: emissionsToSave,
      details: detailsToSave,
      date: new Date().toISOString() // Aggiungiamo il campo date mancante
    };

    editCalculation(updatedCalculation);
  };

  return {
    createNewCalculation,
    removeCalculation,
    updateCalculation,
    isCreating,
    isDeleting,
    isUpdating,
  };
};
