
import { useState } from 'react';

interface CompanyDataState {
  name: string;
  vat_number: string;
  ateco_code: string;
  nace_code: string;
  legal_form: string;
  collective_agreement: string;
  profile_about: string;
  profile_values: string;
  profile_mission: string;
  profile_vision: string;
  profile_value_chain: string;
  profile_value_creation_factors: string;
  is_part_of_group: boolean;
  has_multiple_locations: boolean;
  address_street_type: string;
  address_street: string;
  address_number: string;
  address_postal_code: string;
  address_city: string;
  address_province: string;
}

export const useCompanyInfoState = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  const [companyData, setCompanyData] = useState<CompanyDataState>({
    name: '',
    vat_number: '',
    ateco_code: '',
    nace_code: '',
    legal_form: '',
    collective_agreement: '',
    profile_about: '',
    profile_values: '',
    profile_mission: '',
    profile_vision: '',
    profile_value_chain: '',
    profile_value_creation_factors: '',
    is_part_of_group: false,
    has_multiple_locations: false,
    address_street_type: '',
    address_street: '',
    address_number: '',
    address_postal_code: '',
    address_city: '',
    address_province: ''
  });

  return {
    companyData,
    setCompanyData,
    isSaving,
    setIsSaving
  };
};

// Export the CompanyDataState for reuse in other hooks
export type { CompanyDataState };
