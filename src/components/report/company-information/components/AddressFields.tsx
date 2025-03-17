
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [postalCodes, setPostalCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState({
    provinces: false,
    municipalities: false
  });
  const [databaseStatus, setDatabaseStatus] = useState<'empty' | 'loading' | 'loaded' | 'error'>('loading');
  const [populatingData, setPopulatingData] = useState(false);

  // Check if provinces data exists on component mount
  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  // Load provinces once database is confirmed to have data
  useEffect(() => {
    if (databaseStatus === 'loaded') {
      loadProvinces();
    }
  }, [databaseStatus]);

  // Load municipalities when province changes
  useEffect(() => {
    if (addressData.address_province && databaseStatus === 'loaded') {
      loadMunicipalities(addressData.address_province);
    } else {
      setMunicipalities([]);
      setPostalCodes([]);
    }
  }, [addressData.address_province, databaseStatus]);

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

  const checkDatabaseStatus = async () => {
    setDatabaseStatus('loading');
    try {
      // Check if provinces table has data
      const { count, error } = await supabase
        .from('provinces')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      if (count && count > 0) {
        setDatabaseStatus('loaded');
      } else {
        setDatabaseStatus('empty');
      }
    } catch (error) {
      console.error('Error checking database status:', error);
      setDatabaseStatus('error');
    }
  };

  const populateLocationData = async () => {
    setPopulatingData(true);
    try {
      const { data, error } = await supabase.functions.invoke('populate-italian-locations');
      
      if (error) {
        throw error;
      }

      console.log('Population result:', data);
      
      if (data.message.includes('already populated')) {
        toast({
          title: 'Dati già presenti',
          description: 'Il database contiene già i dati delle località italiane.',
        });
      } else {
        toast({
          title: 'Dati caricati con successo',
          description: `Sono state caricate ${data.provincesCount} province e ${data.municipalitiesCount} comuni.`,
        });
      }
      
      // Refresh database status
      await checkDatabaseStatus();
      
      // If data is now loaded, load provinces
      if (databaseStatus === 'loaded') {
        await loadProvinces();
      }
    } catch (error) {
      console.error('Error populating location data:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante il caricamento dei dati delle località.',
        variant: 'destructive',
      });
    } finally {
      setPopulatingData(false);
    }
  };

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

      console.log(`Loaded ${data?.length || 0} municipalities for province ${provinceCode}`);
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
      {databaseStatus === 'empty' && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-800">Database località non inizializzato</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p className="mb-2">Il database delle località italiane (province e comuni) è vuoto.</p>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
              onClick={populateLocationData}
              disabled={populatingData}
            >
              {populatingData ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Caricamento in corso...
                </>
              ) : (
                'Inizializza database località'
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {databaseStatus === 'error' && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Errore di connessione</AlertTitle>
          <AlertDescription>
            <p className="mb-2">Impossibile verificare lo stato del database delle località.</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={checkDatabaseStatus}
              className="bg-white text-destructive border-destructive/50 hover:bg-destructive/10"
            >
              Riprova
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
            disabled={databaseStatus !== 'loaded' || isLoading.provinces}
          >
            <SelectTrigger id="address_province">
              <SelectValue placeholder={
                databaseStatus === 'empty' ? "Database non inizializzato" : 
                databaseStatus === 'loading' || isLoading.provinces ? "Caricamento..." : 
                "Seleziona provincia..."
              } />
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
            disabled={!addressData.address_province || databaseStatus !== 'loaded' || isLoading.municipalities}
          >
            <SelectTrigger id="address_city">
              <SelectValue placeholder={
                databaseStatus === 'empty' ? "Database non inizializzato" : 
                isLoading.municipalities ? "Caricamento..." : 
                !addressData.address_province ? "Seleziona prima la provincia" :
                municipalities.length === 0 ? "Nessun comune trovato" :
                "Seleziona comune..."
              } />
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
