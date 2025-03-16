
export interface Province {
  code: string;
  name: string;
}

export interface Municipality {
  name: string;
  province_code: string;
  postal_codes: string[] | string;
}

export interface RequestData {
  targetTable?: string;
  province?: string;
  customData?: {
    municipalities?: Municipality[];
    postalCodes?: any;
  };
  clearExisting?: boolean;
}
