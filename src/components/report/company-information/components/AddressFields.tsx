
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
        const codes = selectedMunicipality.postal_codes || [];
        console.log("Setting postal codes for municipality:", selectedMunicipality.name, codes);
        setPostalCodes(codes);
        
        // If only one postal code is available or none currently selected, auto-select it
        if (codes.length === 1 || !addressData.address_postal_code) {
          onChange({ address_postal_code: codes[0] || '' });
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
      console.log("Loading provinces...");
      const { data, error } = await supabase
        .from('provinces')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading provinces:', error);
        toast({
          title: 'Errore',
          description: 'Impossibile caricare le province: ' + error.message,
          variant: 'destructive',
        });
        return;
      }

      if (!data || data.length === 0) {
        console.log("No provinces found, attempting to populate data...");
        try {
          const { data: populateData, error: populateError } = await supabase.functions.invoke('populate-italian-locations');
          
          if (populateError) {
            console.error('Error populating location data:', populateError);
            toast({
              title: 'Errore',
              description: 'Impossibile popolare i dati di località',
              variant: 'destructive',
            });
          } else {
            console.log("Location data populated successfully:", populateData);
            // Try loading provinces again
            const { data: refreshedData, error: refreshError } = await supabase
              .from('provinces')
              .select('*')
              .order('name');
              
            if (refreshError) {
              throw refreshError;
            }
            
            setProvinces(refreshedData || []);
            console.log('Province caricate dopo popolamento:', refreshedData?.length || 0);
          }
        } catch (populateErr) {
          console.error('Failed to populate location data:', populateErr);
        }
      } else {
        setProvinces(data);
        console.log('Province caricate:', data?.length || 0);
      }
    } catch (error) {
      console.error('Failed to load provinces:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare le province',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  const loadMunicipalities = async (provinceCode: string) => {
    setIsLoading(prev => ({ ...prev, municipalities: true }));
    setMunicipalities([]);
    try {
      console.log('Caricamento comuni per la provincia:', provinceCode);
      
      const { data, error } = await supabase
        .from('municipalities')
        .select('*')
        .eq('province_code', provinceCode)
        .order('name');

      if (error) {
        console.error('Error loading municipalities:', error);
        toast({
          title: 'Errore',
          description: 'Impossibile caricare i comuni: ' + error.message,
          variant: 'destructive',
        });
        return;
      }

      if (!data || data.length === 0) {
        console.log("No municipalities found for province:", provinceCode);
        toast({
          title: 'Nessun comune trovato',
          description: `Non ci sono comuni disponibili per la provincia selezionata (${provinceCode})`,
        });
      } else {
        console.log('Comuni caricati:', data.length, 'per la provincia', provinceCode);
        console.log('Primi 3 comuni:', data.slice(0, 3).map(m => m.name));
        setMunicipalities(data);
        
        // Reset city and postal code when municipalities change
        if (addressData.address_city) {
          const cityExists = data.some(m => m.name === addressData.address_city);
          if (!cityExists) {
            onChange({ 
              address_city: '',
              address_postal_code: ''
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load municipalities:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare i comuni',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, municipalities: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    console.log(`Changing ${name} to ${value}`);
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
              <SelectValue placeholder={isLoading.provinces ? "Caricamento..." : "Seleziona provincia..."} />
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
              <SelectValue placeholder={isLoading.municipalities ? "Caricamento..." : municipalities.length === 0 ? "Nessun comune disponibile" : "Seleziona comune..."} />
            </SelectTrigger>
            <SelectContent>
              {municipalities.length > 0 ? (
                municipalities.map((municipality) => (
                  <SelectItem key={municipality.id} value={municipality.name}>
                    {municipality.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="">Nessun comune disponibile</SelectItem>
              )}
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
