
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CompanyLocation } from "@/components/report/company-information/CompanyGeneralInfo";
import { MapPin } from 'lucide-react';

interface LocationSelectorProps {
  locations: CompanyLocation[];
  selectedLocationId: string;
  onLocationChange: (locationId: string) => void;
  isLoading: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  locations,
  selectedLocationId,
  onLocationChange,
  isLoading
}) => {
  // Format location name for display
  const formatLocationName = (location: CompanyLocation): string => {
    const locationType = location.location_type ? 
      (location.location_type === 'sede_legale' ? 'Sede Legale' :
       location.location_type === 'sede_operativa' ? 'Sede Operativa' :
       location.location_type === 'stabilimento' ? 'Stabilimento' :
       location.location_type === 'magazzino' ? 'Magazzino' :
       location.location_type === 'ufficio' ? 'Ufficio' : 'Altro') : 'Sede';
    
    const address = [
      location.address_street_type, 
      location.address_street, 
      location.address_number
    ].filter(Boolean).join(' ');
    
    const cityInfo = [
      location.address_postal_code,
      location.address_city,
      location.address_province ? `(${location.address_province})` : ''
    ].filter(Boolean).join(' ');
    
    return `${locationType}${address ? ': ' + address : ''}${cityInfo ? ', ' + cityInfo : ''}`;
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <MapPin className="mr-2 h-5 w-5 text-blue-500" />
        <Label htmlFor="location-selector" className="text-lg font-semibold">Seleziona Sede</Label>
      </div>
      <p className="text-sm text-slate-600 mb-3">
        I dati ambientali devono essere inseriti per ciascuna sede operativa dell'azienda.
        Seleziona la sede per cui stai inserendo i dati.
      </p>
      <Select
        value={selectedLocationId}
        onValueChange={onLocationChange}
        disabled={isLoading || locations.length === 0}
      >
        <SelectTrigger id="location-selector" className="w-full">
          <SelectValue placeholder="Seleziona una sede..." />
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location.id} value={location.id || ''}>
              {formatLocationName(location)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationSelector;
