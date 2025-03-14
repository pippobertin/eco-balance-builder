
import React, { useState } from 'react';
import { PlusCircle, MapPin, Trash2, Edit, Save, X } from 'lucide-react';
import { CompanyLocation } from '../CompanyGeneralInfo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

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
    address: '',
    location_type: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, location_type: value }));
  };

  const resetForm = () => {
    setFormData({
      address: '',
      location_type: ''
    });
    setIsAdding(false);
    setEditingIndex(null);
  };

  const handleSubmit = () => {
    if (!formData.address) return;

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
            <Card key={location.id || index} className="p-4">
              {editingIndex === index ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor={`edit-address-${index}`}>Indirizzo *</Label>
                      <Input
                        id={`edit-address-${index}`}
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Indirizzo della sede"
                      />
                    </div>
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
                  </div>
                  <div className="flex justify-end space-x-2">
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
                      disabled={!formData.address}
                    >
                      <Save className="h-4 w-4 mr-1" /> Salva
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">
                        {location.address}
                      </p>
                      {location.location_type && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {location.location_type === 'sede_legale' && 'Sede Legale'}
                          {location.location_type === 'sede_operativa' && 'Sede Operativa'}
                          {location.location_type === 'stabilimento' && 'Stabilimento'}
                          {location.location_type === 'magazzino' && 'Magazzino'}
                          {location.location_type === 'ufficio' && 'Ufficio'}
                          {location.location_type === 'altro' && 'Altro'}
                        </p>
                      )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="new-location-address">Indirizzo *</Label>
                <Input
                  id="new-location-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Indirizzo della sede"
                />
              </div>
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
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={resetForm}
              >
                <X className="h-4 w-4 mr-1" /> Annulla
              </Button>
              <Button 
                variant="default" 
                onClick={handleSubmit}
                disabled={!formData.address}
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
