
export interface AddressData {
  address_street_type: string;
  address_street: string;
  address_number: string;
  address_postal_code: string;
  address_city: string;
  address_province: string;
}

export interface AddressFieldsProps {
  addressData: Partial<AddressData>;
  onChange: (data: Partial<AddressData>) => void;
  disabled?: boolean;
}

export interface ProvinceFieldProps {
  value: string;
  onChange: (value: string) => void;
  provinces: Array<{code: string; name: string}>;
  isLoading?: boolean;
  disabled?: boolean;
}

export interface CityFieldProps {
  value: string;
  onChange: (value: string) => void;
  cities: Array<{name: string; postal_codes: string | string[];}>;
  isLoading?: boolean;
  disabled?: boolean;
}

export interface PostalCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export interface StreetFieldsProps {
  streetType: string;
  streetName: string;
  streetNumber: string;
  onChangeStreetType: (value: string) => void;
  onChangeStreetName: (value: string) => void;
  onChangeStreetNumber: (value: string) => void;
  disabled?: boolean;
}

// Add missing types
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
