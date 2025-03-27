
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CompanyLocation } from "@/components/report/company-information/CompanyGeneralInfo";
import { MapPin } from 'lucide-react';
import { formatLocationName } from '../hooks/location-metrics';

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
            <SelectItem key={location.id || 'main-location'} value={location.id || 'main-location'}>
              {formatLocationName(location)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationSelector;
