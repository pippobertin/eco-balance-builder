
import { Province } from './types';

export const formatProvinceName = (name: string, code: string): string => {
  return `${name} (${code})`;
};

export const formatAddress = (address: {
  address_street_type?: string;
  address_street?: string;
  address_number?: string;
  address_postal_code?: string;
  address_city?: string;
  address_province?: string;
}): string => {
  const parts = [];
  
  if (address.address_street_type) {
    parts.push(address.address_street_type.charAt(0).toUpperCase() + address.address_street_type.slice(1));
  }
  
  if (address.address_street) {
    parts.push(address.address_street);
  }
  
  if (address.address_number) {
    parts.push(address.address_number);
  }
  
  const firstLine = parts.join(' ');
  
  const secondLineParts = [];
  
  if (address.address_postal_code) {
    secondLineParts.push(address.address_postal_code);
  }
  
  if (address.address_city) {
    secondLineParts.push(address.address_city);
  }
  
  if (address.address_province) {
    secondLineParts.push(`(${address.address_province})`);
  }
  
  const secondLine = secondLineParts.join(' ');
  
  return [firstLine, secondLine].filter(Boolean).join(', ');
};
