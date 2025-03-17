
import React from 'react';
import AddressFields, { AddressData } from './AddressFields';

interface MainAddressSectionProps {
  addressData: {
    address_street_type: string;
    address_street: string;
    address_number: string;
    address_postal_code: string;
    address_city: string;
    address_province: string;
  };
  onChange: (data: Partial<AddressData>) => void;
}

const MainAddressSection: React.FC<MainAddressSectionProps> = ({ addressData, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Indirizzo Sede Principale</h3>
      <AddressFields 
        addressData={addressData}
        onChange={onChange}
      />
    </div>
  );
};

export default MainAddressSection;
