import React, { useState } from 'react';
import { PlusCircle, MapPin, Trash2, Edit, Save, X } from 'lucide-react';
import { CompanyLocation } from '../CompanyGeneralInfo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import AddressFields, { AddressData } from './address';

interface CompanyLocationsSectionProps {
  locations: CompanyLocation[];
  onAddLocation: (location: CompanyLocation) => void;
  onUpdateLocation: (index: number, location: CompanyLocation) => void;
  onRemoveLocation: (index: number) => void;
}

const CompanyLocationsSection: React.FC<CompanyLocationsSectionProps> = ({
  locations,
  onAddLocation,
  onUpdateLocation,
  onRemoveLocation
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<CompanyLocation>({
    location_type: '',
    address_street_type: '',
    address_street: '',
    address_number: '',
    address_postal_code: '',
    address_city: '',
    address_province: ''
  });

  const handleLocationTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, location_type: value }));
  };

  const handleAddressChange = (data: Partial<AddressData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      location_type: '',
      address_street_type: '',
      address_street: '',
      address_number: '',
      address_postal_code: '',
      address_city: '',
      address_province: ''
    });
    setIsAdding(false);
    setEditingIndex(null);
  };

  const handleSubmit = () => {
    const hasAddress = formData.address_street_type && formData.address_street;
    
    if (!hasAddress) return;

    if (editingIndex !== null) {
      onUpdateLocation(editingIndex, formData);
    } else {
      onAddLocation(formData);
    }
    resetForm();
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setFormData(locations[index]);
  };

  const formatAddress = (location: CompanyLocation): string => {
    const parts = [];
    
    if (location.address_street_type) {
      parts.push(location.address_street_type.charAt(0).toUpperCase() + location.address_street_type.slice(1));
    }
    
    if (location.address_street) {
      parts.push(location.address_street);
    }
    
    if (location.address_number) {
      parts.push(location.address_number);
    }
    
    const firstLine = parts.join(' ');
    
    const secondLineParts = [];
    
    if (location.address_postal_code) {
      secondLineParts.push(location.address_postal_code);
    }
    
    if (location.address_city) {
      secondLineParts.push(location.address_city);
    }
    
    if (location.address_province) {
      secondLineParts.push(`(${location.address_province})`);
    }
    
    const secondLine = secondLineParts.join(' ');
    
    return [firstLine, secondLine].filter(Boolean).join(', ');
  };

  return (
    <div className="mt-6 pt-4 border-t">
      <div className="flex items-center mb-4">
        <MapPin className="mr-2 h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">Sedi e Stabilimenti</h3>
      </div>

      {locations.length > 0 && (
        <div className="grid gap-4 mb-6">
          {locations.map((location, index) => (
            <Card key={location.id || index} className="p-4">
              {editingIndex === index ? (
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor={`edit-type-${index}`}>Tipo di Sede</Label>
                    <Select 
                      value={formData.location_type || ''} 
                      onValueChange={handleLocationTypeChange}
                    >
                      <SelectTrigger id={`edit-type-${index}`}>
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
                    <h4 className="font-medium mb-2">Indirizzo</h4>
                    <AddressFields 
                      addressData={{
                        address_street_type: formData.address_street_type || '',
                        address_street: formData.address_street || '',
                        address_number: formData.address_number || '',
                        address_postal_code: formData.address_postal_code || '',
                        address_city: formData.address_city || '',
                        address_province: formData.address_province || ''
                      }}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetForm}
                    >
                      <X className="h-4 w-4 mr-1" /> Annulla
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={handleSubmit}
                      disabled={!formData.address_street_type || !formData.address_street}
                    >
                      <Save className="h-4 w-4 mr-1" /> Salva
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {location.location_type === 'sede_legale' && 'Sede Legale'}
                        {location.location_type === 'sede_operativa' && 'Sede Operativa'}
                        {location.location_type === 'stabilimento' && 'Stabilimento'}
                        {location.location_type === 'magazzino' && 'Magazzino'}
                        {location.location_type === 'ufficio' && 'Ufficio'}
                        {location.location_type === 'altro' && 'Altro'}
                      </p>
                      <p className="text-sm mt-2">{formatAddress(location)}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => startEditing(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onRemoveLocation(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="border p-4 rounded-md shadow-sm mb-4">
          <h4 className="font-medium mb-3">Aggiungi Sede</h4>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="new-location-type">Tipo di Sede</Label>
              <Select 
                value={formData.location_type || ''} 
                onValueChange={handleLocationTypeChange}
              >
                <SelectTrigger id="new-location-type">
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
                onChange={handleAddressChange}
              />
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={resetForm}
              >
                <X className="h-4 w-4 mr-1" /> Annulla
              </Button>
              <Button 
                variant="default" 
                onClick={handleSubmit}
                disabled={!formData.address_street_type || !formData.address_street}
              >
                <Save className="h-4 w-4 mr-1" /> Aggiungi
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => setIsAdding(true)}
          className="mb-4"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> 
          Aggiungi Sede o Stabilimento
        </Button>
      )}
    </div>
  );
};

export default CompanyLocationsSection;
