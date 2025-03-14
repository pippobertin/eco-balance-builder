
import React, { useState } from 'react';
import { PlusCircle, Building, Trash2, Edit, Save, X } from 'lucide-react';
import { GroupCompany } from '../CompanyGeneralInfo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface GroupCompaniesSectionProps {
  groupCompanies: GroupCompany[];
  onAddCompany: (company: GroupCompany) => void;
  onUpdateCompany: (index: number, company: GroupCompany) => void;
  onRemoveCompany: (index: number) => void;
}

const GroupCompaniesSection: React.FC<GroupCompaniesSectionProps> = ({
  groupCompanies,
  onAddCompany,
  onUpdateCompany,
  onRemoveCompany
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<GroupCompany>({
    name: '',
    address: '',
    relationship_type: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRelationshipChange = (value: string) => {
    setFormData(prev => ({ ...prev, relationship_type: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      relationship_type: ''
    });
    setIsAdding(false);
    setEditingIndex(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.relationship_type) return;

    if (editingIndex !== null) {
      onUpdateCompany(editingIndex, formData);
    } else {
      onAddCompany(formData);
    }
    resetForm();
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setFormData(groupCompanies[index]);
  };

  return (
    <div className="mt-6 pt-4 border-t">
      <div className="flex items-center mb-4">
        <Building className="mr-2 h-5 w-5 text-green-500" />
        <h3 className="text-lg font-medium">Aziende del Gruppo</h3>
      </div>

      {groupCompanies.length > 0 && (
        <div className="grid gap-4 mb-6">
          {groupCompanies.map((company, index) => (
            <Card key={company.id || index} className="p-4">
              {editingIndex === index ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`edit-name-${index}`}>Denominazione</Label>
                      <Input
                        id={`edit-name-${index}`}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nome dell'azienda"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-relationship-${index}`}>Relazione</Label>
                      <Select 
                        value={formData.relationship_type} 
                        onValueChange={handleRelationshipChange}
                      >
                        <SelectTrigger id={`edit-relationship-${index}`}>
                          <SelectValue placeholder="Tipo di relazione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="controllata">Controllata</SelectItem>
                          <SelectItem value="controllante">Controllante</SelectItem>
                          <SelectItem value="collegata">Collegata</SelectItem>
                          <SelectItem value="associata">Associata</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`edit-address-${index}`}>Indirizzo</Label>
                    <Input
                      id={`edit-address-${index}`}
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Indirizzo dell'azienda"
                    />
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
                    >
                      <Save className="h-4 w-4 mr-1" /> Salva
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{company.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {company.relationship_type === 'controllata' && 'Controllata'}
                        {company.relationship_type === 'controllante' && 'Controllante'}
                        {company.relationship_type === 'collegata' && 'Collegata'}
                        {company.relationship_type === 'associata' && 'Associata'}
                      </p>
                      {company.address && (
                        <p className="text-sm mt-2">{company.address}</p>
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
                        onClick={() => onRemoveCompany(index)}
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
          <h4 className="font-medium mb-3">Aggiungi Azienda</h4>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-company-name">Denominazione *</Label>
                <Input
                  id="new-company-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome dell'azienda"
                />
              </div>
              <div>
                <Label htmlFor="new-company-relationship">Relazione *</Label>
                <Select 
                  value={formData.relationship_type} 
                  onValueChange={handleRelationshipChange}
                >
                  <SelectTrigger id="new-company-relationship">
                    <SelectValue placeholder="Tipo di relazione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="controllata">Controllata</SelectItem>
                    <SelectItem value="controllante">Controllante</SelectItem>
                    <SelectItem value="collegata">Collegata</SelectItem>
                    <SelectItem value="associata">Associata</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="new-company-address">Indirizzo</Label>
              <Input
                id="new-company-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Indirizzo dell'azienda"
              />
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
                disabled={!formData.name || !formData.relationship_type}
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
          Aggiungi Azienda del Gruppo
        </Button>
      )}
    </div>
  );
};

export default GroupCompaniesSection;
