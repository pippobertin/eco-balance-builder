import React from 'react';
import { Building, Plus } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import CompanyBasicInfo from './components/CompanyBasicInfo';
import ActivityCodes from './components/ActivityCodes';
import LegalDetails from './components/LegalDetails';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import GroupCompaniesSection from './components/GroupCompaniesSection';
import CompanyLocationsSection from './components/CompanyLocationsSection';
import { AddressFields } from './components/address';
import { AddressData } from './components/address/types';

interface CompanyGeneralInfoProps {
  companyData: {
    name: string;
    vat_number: string;
    ateco_code: string;
    nace_code: string;
    legal_form: string;
    collective_agreement: string;
    is_part_of_group: boolean;
    has_multiple_locations: boolean;
    address_street_type: string;
    address_street: string;
    address_number: string;
    address_postal_code: string;
    address_city: string;
    address_province: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  handleAddressChange: (data: Partial<AddressData>) => void;
  groupCompanies: GroupCompany[];
  companyLocations: CompanyLocation[];
  handleAddGroupCompany: (company: GroupCompany) => void;
  handleUpdateGroupCompany: (index: number, company: GroupCompany) => void;
  handleRemoveGroupCompany: (index: number) => void;
  handleAddLocation: (location: CompanyLocation) => void;
  handleUpdateLocation: (index: number, location: CompanyLocation) => void;
  handleRemoveLocation: (index: number) => void;
}

export interface GroupCompany {
  id?: string;
  name: string;
  relationship_type: string;
  address_street_type?: string;
  address_street?: string;
  address_number?: string;
  address_postal_code?: string;
  address_city?: string;
  address_province?: string;
}

export interface CompanyLocation {
  id?: string;
  location_type: string;
  address_street_type?: string;
  address_street?: string;
  address_number?: string;
  address_postal_code?: string;
  address_city?: string;
  address_province?: string;
}

const CompanyGeneralInfo: React.FC<CompanyGeneralInfoProps> = ({ 
  companyData, 
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange,
  handleAddressChange,
  groupCompanies,
  companyLocations,
  handleAddGroupCompany,
  handleUpdateGroupCompany,
  handleRemoveGroupCompany,
  handleAddLocation,
  handleUpdateLocation,
  handleRemoveLocation
}) => {
  // Handle VAT number input to ensure only numbers and max 11 chars
  const handleVatNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    const target = { 
      name: e.target.name, 
      value 
    };
    handleInputChange({ target } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <Building className="mr-2 h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-semibold">Informazioni Generali dell'Azienda</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <CompanyBasicInfo 
          name={companyData.name}
          vatNumber={companyData.vat_number}
          handleInputChange={handleInputChange}
          handleVatNumberChange={handleVatNumberChange}
        />
        
        <ActivityCodes 
          atecoCode={companyData.ateco_code}
          naceCode={companyData.nace_code}
          handleSelectChange={handleSelectChange}
        />
        
        <LegalDetails 
          legalForm={companyData.legal_form}
          collectiveAgreement={companyData.collective_agreement}
          handleSelectChange={handleSelectChange}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Indirizzo Sede Principale</h3>
        <AddressFields 
          addressData={{
            address_street_type: companyData.address_street_type,
            address_street: companyData.address_street,
            address_number: companyData.address_number,
            address_postal_code: companyData.address_postal_code,
            address_city: companyData.address_city,
            address_province: companyData.address_province
          }}
          onChange={handleAddressChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="is_part_of_group" 
            checked={companyData.is_part_of_group} 
            onCheckedChange={(checked) => handleCheckboxChange('is_part_of_group', checked as boolean)}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="is_part_of_group" className="text-sm font-medium">
              L'azienda fa parte di un gruppo
            </Label>
            <p className="text-sm text-muted-foreground">
              Seleziona questa opzione se l'azienda è parte di un gruppo societario
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="has_multiple_locations" 
            checked={companyData.has_multiple_locations} 
            onCheckedChange={(checked) => handleCheckboxChange('has_multiple_locations', checked as boolean)}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="has_multiple_locations" className="text-sm font-medium">
              L'azienda ha più sedi o stabilimenti
            </Label>
            <p className="text-sm text-muted-foreground">
              Seleziona questa opzione se l'azienda ha più sedi o stabilimenti oltre alla sede principale
            </p>
          </div>
        </div>
      </div>

      {companyData.is_part_of_group && (
        <GroupCompaniesSection 
          groupCompanies={groupCompanies}
          onAddCompany={handleAddGroupCompany}
          onUpdateCompany={handleUpdateGroupCompany}
          onRemoveCompany={handleRemoveGroupCompany}
        />
      )}

      {companyData.has_multiple_locations && (
        <CompanyLocationsSection
          locations={companyLocations}
          onAddLocation={handleAddLocation}
          onUpdateLocation={handleUpdateLocation}
          onRemoveLocation={handleRemoveLocation}
        />
      )}
    </GlassmorphicCard>
  );
};

export default CompanyGeneralInfo;
