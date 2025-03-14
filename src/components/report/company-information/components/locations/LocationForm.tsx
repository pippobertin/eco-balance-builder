
import React from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddressFields } from '../address';
import { LocationFormProps } from './types';

const LocationForm: React.FC<LocationFormProps> = ({
  formData,
  onLocationTypeChange,
  onAddressChange,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  return (
    <div className="grid gap-4">
      <div>
        <Label htmlFor="location-type">Tipo di Sede</Label>
        <Select 
          value={formData.location_type || ''} 
          onValueChange={onLocationTypeChange}
        >
          <SelectTrigger id="location-type">
            <SelectValue placeholder="Tipo di sede" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sede_legale">Sede Legale</SelectItem>
            <SelectItem value="sede_operativa">Sede Operativa</SelectItem>
            <SelectItem value="stabilimento">Stabilimento</SelectItem>
            <SelectItem value="magazzino">Magazzino</SelectItem>
            <SelectItem value="ufficio">Ufficio</SelectItem>
            <SelectItem value="altro">Altro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mt-2">
        <h4 className="font-medium mb-2">Indirizzo *</h4>
        <AddressFields 
          addressData={{
            address_street_type: formData.address_street_type || '',
            address_street: formData.address_street || '',
            address_number: formData.address_number || '',
            address_postal_code: formData.address_postal_code || '',
            address_city: formData.address_city || '',
            address_province: formData.address_province || ''
          }}
          onChange={onAddressChange}
        />
      </div>
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          <X className="h-4 w-4 mr-1" /> Annulla
        </Button>
        <Button 
          variant="default" 
          onClick={onSubmit}
          disabled={!formData.address_street_type || !formData.address_street}
        >
          <Save className="h-4 w-4 mr-1" /> {isEditing ? 'Salva' : 'Aggiungi'}
        </Button>
      </div>
    </div>
  );
};

export default LocationForm;
