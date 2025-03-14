
import React from 'react';
import { AddressData } from './types';
import { useAddressFields } from './useAddressFields';
import StreetFields from './StreetFields';
import NumberField from './NumberField';
import ProvinceField from './ProvinceField';
import CityField from './CityField';
import PostalCodeField from './PostalCodeField';

interface AddressFieldsProps {
  addressData: AddressData;
  onChange: (data: Partial<AddressData>) => void;
  className?: string;
}

const AddressFields: React.FC<AddressFieldsProps> = ({
  addressData,
  onChange,
  className = ''
}) => {
  const {
    provinces,
    municipalities,
    postalCodes,
    isLoading
  } = useAddressFields(
    addressData.address_province,
    addressData.address_city
  );

  const handleFieldChange = (field: string, value: string) => {
    onChange({ [field]: value });
    
    // Clear dependent fields when parent field changes
    if (field === 'address_province') {
      onChange({ 
        address_city: '',
        address_postal_code: ''
      });
    } else if (field === 'address_city') {
      onChange({ address_postal_code: '' });
      
      // Auto-select postal code if only one is available
      if (municipalities.length > 0) {
        const selectedMunicipality = municipalities.find(m => m.name === value);
        if (selectedMunicipality && selectedMunicipality.postal_codes?.length === 1) {
          onChange({ address_postal_code: selectedMunicipality.postal_codes[0] });
        }
      }
    }
  };

  return (
    <div className={`grid gap-4 ${className}`}>
      <StreetFields 
        streetType={addressData.address_street_type}
        street={addressData.address_street}
        onChange={handleFieldChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NumberField 
          number={addressData.address_number}
          onChange={handleFieldChange}
        />
        
        <ProvinceField 
          province={addressData.address_province}
          provinces={provinces}
          isLoading={isLoading.provinces}
          onChange={handleFieldChange}
        />
        
        <CityField 
          city={addressData.address_city}
          municipalities={municipalities}
          provinceSelected={!!addressData.address_province}
          isLoading={isLoading.municipalities}
          onChange={handleFieldChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PostalCodeField 
          postalCode={addressData.address_postal_code}
          postalCodes={postalCodes}
          citySelected={!!addressData.address_city}
          onChange={handleFieldChange}
        />
      </div>
    </div>
  );
};

export default AddressFields;
