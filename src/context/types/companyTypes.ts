
// Define interfaces for companies
export interface Company {
  id: string;
  name: string;
  vat_number?: string;
  country?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  created_by?: string;
  sector?: string;
  ateco_code?: string;
  nace_code?: string;
  legal_form?: string;
  collective_agreement?: string;
  profile_about?: string;
  profile_values?: string;
  profile_mission?: string;
  profile_vision?: string;
  profile_value_chain?: string;
  profile_value_creation_factors?: string;
  is_part_of_group?: boolean;
  has_multiple_locations?: boolean;
  address_street_type?: string;
  address_street?: string;
  address_number?: string;
  address_postal_code?: string;
  address_city?: string;
  address_province?: string;
}

// Define subsidiary company
export interface Subsidiary {
  id?: string;
  report_id?: string;
  name: string;
  location: string;
}
