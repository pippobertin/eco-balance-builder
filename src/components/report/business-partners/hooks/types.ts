
// General types
export interface SaveButtonProps {
  onClick: () => Promise<void | boolean>; 
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

// BP specific types for all business partners modules
export interface BP1FormData {
  controversialWeapons?: boolean;
  tobacco?: boolean;
  fossilFuels?: boolean;
  chemicals?: boolean;
  controversialWeaponsRevenue?: number;
  tobaccoRevenue?: number;
  coalRevenue?: number;
  oilRevenue?: number;
  gasRevenue?: number;
  chemicalsRevenue?: number;
}

export interface BP2FormData {
  maleGovernanceMembers?: number;
  femaleGovernanceMembers?: number;
  otherGenderGovernanceMembers?: number;
  genderDiversityIndex?: number;
}

export interface BusinessPartnersHookResult {
  data: {
    bp1?: BP1FormData;
    bp2?: BP2FormData;
    // Add other BP data types as needed
  };
  updateData: (module: string, data: any) => void;
  saveAll: () => Promise<boolean>;
  isLoading: boolean;
  lastSaved: Date | null;
  needsSaving: boolean;
}
