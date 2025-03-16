
// Types for the populate-italian-locations function

export interface RequestData {
  province?: string;
  targetTable?: string;
  customData?: {
    municipalities?: any[];
    postalCodes?: any[];
  };
  clearExisting?: boolean;
}

export interface Municipality {
  name: string;
  province_code: string;
  postal_codes: string | string[];
}

export interface Province {
  code: string;
  name: string;
}

export interface MunEntity {
  id?: number;
  name: string;
  province_code: string;
  postal_codes: string;
}
