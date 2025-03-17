
export interface Province {
  code: string;
  name: string;
}

export interface Municipality {
  id: number;
  name: string;
  province_code: string;
  postal_codes: string[];
}

export interface AddressData {
  address_street_type: string;
  address_street: string;
  address_number: string;
  address_postal_code: string;
  address_city: string;
  address_province: string;
}

export const streetTypes = [
  { value: 'via', label: 'Via' },
  { value: 'viale', label: 'Viale' },
  { value: 'piazza', label: 'Piazza' },
  { value: 'largo', label: 'Largo' },
  { value: 'corso', label: 'Corso' },
  { value: 'vicolo', label: 'Vicolo' },
  { value: 'strada', label: 'Strada' },
  { value: 'località', label: 'Località' },
];
