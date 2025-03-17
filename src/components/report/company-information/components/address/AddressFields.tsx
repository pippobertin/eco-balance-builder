
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddressData } from './types';
import { useAddressData } from './useAddressData';
import DatabaseStatusAlert from './DatabaseStatusAlert';
import StreetTypeField from './StreetTypeField';
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
    isLoading,
    databaseStatus,
    populatingData,
    error,
    checkDatabaseStatus,
    populateLocationData,
    loadMunicipalities,
    updatePostalCodes
  } = useAddressData(addressData.address_province);

  // Load municipalities when province changes
  useEffect(() => {
    if (addressData.address_province && databaseStatus === 'loaded') {
      loadMunicipalities(addressData.address_province);
    }
  }, [addressData.address_province, databaseStatus]);

  // Load postal codes when municipality changes
  useEffect(() => {
    if (addressData.address_city) {
      const availablePostalCodes = updatePostalCodes(addressData.address_city);
      
      // If only one postal code is available or none currently selected, auto-select it
      if (availablePostalCodes.length === 1 && !addressData.address_postal_code) {
        onChange({ address_postal_code: availablePostalCodes[0] });
      }
    }
  }, [addressData.address_city, municipalities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    onChange({ [name]: value });
    
    // Clear dependent fields when parent field changes
    if (name === 'address_province') {
      onChange({ 
        address_city: '',
        address_postal_code: ''
      });
    } else if (name === 'address_city') {
      onChange({ address_postal_code: '' });
    }
  };

  return (
    <div className={`grid gap-4 ${className}`}>
      <DatabaseStatusAlert 
        databaseStatus={databaseStatus}
        error={error}
        populatingData={populatingData}
        onPopulateData={populateLocationData}
        onRetry={checkDatabaseStatus}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StreetTypeField 
          value={addressData.address_street_type} 
          onChange={(value) => handleSelectChange('address_street_type', value)} 
        />
        
        <div className="md:col-span-2">
          <Label htmlFor="address_street">Nome Via/Piazza</Label>
          <Input
            id="address_street"
            name="address_street"
            value={addressData.address_street || ''}
            onChange={handleInputChange}
            placeholder="Nome della via/piazza"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="address_number">Numero Civico</Label>
          <Input
            id="address_number"
            name="address_number"
            value={addressData.address_number || ''}
            onChange={handleInputChange}
            placeholder="Numero civico"
          />
        </div>
        
        <ProvinceField 
          value={addressData.address_province}
          onChange={(value) => handleSelectChange('address_province', value)}
          provinces={provinces}
          isLoading={isLoading.provinces}
          databaseStatus={databaseStatus}
        />
        
        <CityField 
          value={addressData.address_city}
          onChange={(value) => handleSelectChange('address_city', value)}
          municipalities={municipalities}
          isLoading={isLoading.municipalities}
          databaseStatus={databaseStatus}
          provinceSelected={!!addressData.address_province}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PostalCodeField 
          value={addressData.address_postal_code}
          onChange={(value) => handleSelectChange('address_postal_code', value)}
          postalCodes={postalCodes}
          disabled={!addressData.address_city}
        />
      </div>
    </div>
  );
};

export default AddressFields;
