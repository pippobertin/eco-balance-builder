
export interface Company {
  id: string;
  name: string;
  vat_number?: string;
  address?: string;
  address_street_type?: string;
  address_street?: string;
  address_number?: string;
  address_postal_code?: string;
  address_city?: string;
  address_province?: string;
  country?: string;
  contact_email?: string;
  contact_phone?: string;
  legal_form?: string;
  sector?: string;
  ateco_code?: string;
  nace_code?: string;
  created_at?: string;
  updated_at?: string;
  collective_agreement?: string;
  profile_about?: string;
  profile_mission?: string;
  profile_vision?: string;
  profile_values?: string;
  profile_value_chain?: string;
  profile_value_creation_factors?: string;
  has_multiple_locations?: boolean;
  is_part_of_group?: boolean;
  created_by?: string;
}

export interface CompanyLocation {
  id: string;
  company_id: string;
  location_type?: string;
  address_street_type?: string;
  address_street?: string;
  address_number?: string;
  address_postal_code?: string;
  address_city?: string;
  address_province?: string;
  created_at: string;
}

export interface Subsidiary {
  id?: string;
  name: string;
  location: string;
  report_id?: string;
  created_at?: string;
}
