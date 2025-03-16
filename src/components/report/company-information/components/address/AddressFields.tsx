
import React from 'react';
import { AddressFieldsProps } from './types';
import { useAddressFields } from './useAddressFields';
import StreetFields from './StreetFields';
import ProvinceField from './ProvinceField';
import CityField from './CityField';
import PostalCodeField from './PostalCodeField';

const AddressFields: React.FC<AddressFieldsProps> = ({
  addressData,
  onChange,
  disabled = false
}) => {
  const {
    provinces,
    cities,
    postalCodes,
    isLoadingProvinces,
    isLoadingCities
  } = useAddressFields(addressData.address_province);

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
      if (cities.length > 0) {
        const selectedCity = cities.find(m => m.name === value);
        if (selectedCity && Array.isArray(selectedCity.postal_codes) && selectedCity.postal_codes.length === 1) {
          onChange({ address_postal_code: selectedCity.postal_codes[0] });
        }
      }
    }
  };

  return (
    <div className="grid gap-4">
      <StreetFields 
        streetType={addressData.address_street_type || ''}
        streetName={addressData.address_street || ''}
        streetNumber={addressData.address_number || ''}
        onChangeStreetType={(value) => handleFieldChange('address_street_type', value)}
        onChangeStreetName={(value) => handleFieldChange('address_street', value)}
        onChangeStreetNumber={(value) => handleFieldChange('address_number', value)}
        disabled={disabled}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProvinceField 
          value={addressData.address_province || ''}
          onChange={(value) => handleFieldChange('address_province', value)}
          provinces={provinces}
          isLoading={isLoadingProvinces}
          disabled={disabled}
        />
        
        <CityField 
          value={addressData.address_city || ''}
          onChange={(value) => handleFieldChange('address_city', value)}
          cities={cities}
          isLoading={isLoadingCities}
          disabled={!addressData.address_province || disabled}
        />
        
        <PostalCodeField 
          value={addressData.address_postal_code || ''}
          onChange={(value) => handleFieldChange('address_postal_code', value)}
          postalCodes={postalCodes}
          disabled={!addressData.address_city || disabled}
        />
      </div>
    </div>
  );
};

export default AddressFields;
