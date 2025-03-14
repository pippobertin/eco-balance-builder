
import React, { useState } from 'react';
import { PlusCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompanyLocation } from '../../types';
import LocationItem from './LocationItem';
import LocationForm from './LocationForm';
import { LocationFormData } from './types';

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
  const [formData, setFormData] = useState<LocationFormData>({
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

  const handleAddressChange = (data: Partial<any>) => {
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

  return (
    <div className="mt-6 pt-4 border-t">
      <div className="flex items-center mb-4">
        <MapPin className="mr-2 h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">Sedi e Stabilimenti</h3>
      </div>

      {locations.length > 0 && (
        <div className="grid gap-4 mb-6">
          {locations.map((location, index) => (
            editingIndex === index ? (
              <div key={location.id || index} className="border p-4 rounded-md shadow-sm">
                <LocationForm 
                  formData={formData}
                  onLocationTypeChange={handleLocationTypeChange}
                  onAddressChange={handleAddressChange}
                  onSubmit={handleSubmit}
                  onCancel={resetForm}
                  isEditing={true}
                />
              </div>
            ) : (
              <LocationItem 
                key={location.id || index}
                location={location}
                index={index}
                onEdit={startEditing}
                onRemove={onRemoveLocation}
              />
            )
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="border p-4 rounded-md shadow-sm mb-4">
          <h4 className="font-medium mb-3">Aggiungi Sede</h4>
          <LocationForm 
            formData={formData}
            onLocationTypeChange={handleLocationTypeChange}
            onAddressChange={handleAddressChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
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
