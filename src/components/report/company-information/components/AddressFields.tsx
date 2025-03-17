
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

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

interface AddressFieldsProps {
  addressData: AddressData;
  onChange: (data: Partial<AddressData>) => void;
  className?: string;
}

const streetTypes = [
  { value: 'via', label: 'Via' },
  { value: 'viale', label: 'Viale' },
  { value: 'piazza', label: 'Piazza' },
  { value: 'largo', label: 'Largo' },
  { value: 'corso', label: 'Corso' },
  { value: 'vicolo', label: 'Vicolo' },
  { value: 'strada', label: 'Strada' },
  { value: 'località', label: 'Località' },
];

const AddressFields: React.FC<AddressFieldsProps> = ({
  addressData,
  onChange,
  className = ''
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [postalCodes, setPostalCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState({
    provinces: false,
    municipalities: false
  });

  // Load provinces on component mount
  useEffect(() => {
    loadProvinces();
  }, []);

  // Load municipalities when province changes
  useEffect(() => {
    if (addressData.address_province) {
      loadMunicipalities(addressData.address_province);
    } else {
      setMunicipalities([]);
      setPostalCodes([]);
    }
  }, [addressData.address_province]);

  // Load postal codes when municipality changes
  useEffect(() => {
    if (addressData.address_city && municipalities.length > 0) {
      const selectedMunicipality = municipalities.find(m => m.name === addressData.address_city);
      if (selectedMunicipality) {
        setPostalCodes(selectedMunicipality.postal_codes || []);
        
        // If only one postal code is available or none currently selected, auto-select it
        if (selectedMunicipality.postal_codes?.length === 1 || !addressData.address_postal_code) {
          onChange({ address_postal_code: selectedMunicipality.postal_codes[0] });
        }
      } else {
        setPostalCodes([]);
      }
    } else {
      setPostalCodes([]);
    }
  }, [addressData.address_city, municipalities]);

  const loadProvinces = async () => {
    setIsLoading(prev => ({ ...prev, provinces: true }));
    try {
      const { data, error } = await supabase
        .from('provinces')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading provinces:', error);
        return;
      }

      setProvinces(data || []);
    } catch (error) {
      console.error('Failed to load provinces:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  const loadMunicipalities = async (provinceCode: string) => {
    setIsLoading(prev => ({ ...prev, municipalities: true }));
    try {
      const { data, error } = await supabase
        .from('municipalities')
        .select('*')
        .eq('province_code', provinceCode)
        .order('name');

      if (error) {
        console.error('Error loading municipalities:', error);
        return;
      }

      setMunicipalities(data || []);
    } catch (error) {
      console.error('Failed to load municipalities:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, municipalities: false }));
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="address_street_type">Tipo Indirizzo</Label>
          <Select 
            value={addressData.address_street_type || ''}
            onValueChange={(value) => handleSelectChange('address_street_type', value)}
          >
            <SelectTrigger id="address_street_type">
              <SelectValue placeholder="Seleziona..." />
            </SelectTrigger>
            <SelectContent>
              {streetTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
        <div>
          <Label htmlFor="address_province">Provincia</Label>
          <Select 
            value={addressData.address_province || ''}
            onValueChange={(value) => handleSelectChange('address_province', value)}
          >
            <SelectTrigger id="address_province">
              <SelectValue placeholder="Seleziona provincia..." />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province.code} value={province.code}>
                  {province.name} ({province.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="address_city">Comune</Label>
          <Select 
            value={addressData.address_city || ''}
            onValueChange={(value) => handleSelectChange('address_city', value)}
            disabled={!addressData.address_province || isLoading.municipalities}
          >
            <SelectTrigger id="address_city">
              <SelectValue placeholder={isLoading.municipalities ? "Caricamento..." : "Seleziona comune..."} />
            </SelectTrigger>
            <SelectContent>
              {municipalities.map((municipality) => (
                <SelectItem key={municipality.id} value={municipality.name}>
                  {municipality.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="address_postal_code">CAP</Label>
          {postalCodes.length > 1 ? (
            <Select 
              value={addressData.address_postal_code || ''}
              onValueChange={(value) => handleSelectChange('address_postal_code', value)}
              disabled={!addressData.address_city}
            >
              <SelectTrigger id="address_postal_code">
                <SelectValue placeholder="Seleziona CAP..." />
              </SelectTrigger>
              <SelectContent>
                {postalCodes.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="address_postal_code"
              name="address_postal_code"
              value={addressData.address_postal_code || ''}
              onChange={handleInputChange}
              placeholder="CAP"
              disabled={!addressData.address_city}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressFields;
