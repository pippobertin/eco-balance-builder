
import React from 'react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import CompanyBasicInfo from './components/CompanyBasicInfo';
import ActivityCodes from './components/ActivityCodes';
import LegalDetails from './components/LegalDetails';
import HeaderSection from './components/HeaderSection';
import MainAddressSection from './components/MainAddressSection';
import CompanyOptionsSection from './components/CompanyOptionsSection';
import GroupCompaniesSection from './components/GroupCompaniesSection';
import CompanyLocationsSection from './components/CompanyLocationsSection';
import DatabaseDebugInfo from './components/DatabaseDebugInfo';
import { AddressData } from './components/AddressFields';

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
  showDebugInfo?: boolean;
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
  handleRemoveLocation,
  showDebugInfo = true // Default to true for debugging
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

  // Ensure companyData properties are defined
  const safeData = {
    ...companyData,
    name: companyData?.name || '',
    vat_number: companyData?.vat_number || '',
    ateco_code: companyData?.ateco_code || '',
    nace_code: companyData?.nace_code || '',
    legal_form: companyData?.legal_form || '',
    collective_agreement: companyData?.collective_agreement || '',
    is_part_of_group: !!companyData?.is_part_of_group,
    has_multiple_locations: !!companyData?.has_multiple_locations,
    address_street_type: companyData?.address_street_type || '',
    address_street: companyData?.address_street || '',
    address_number: companyData?.address_number || '',
    address_postal_code: companyData?.address_postal_code || '',
    address_city: companyData?.address_city || '',
    address_province: companyData?.address_province || ''
  };

  return (
    <GlassmorphicCard>
      <HeaderSection title="Informazioni Generali dell'Azienda" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <CompanyBasicInfo 
          name={safeData.name}
          vatNumber={safeData.vat_number}
          handleInputChange={handleInputChange}
          handleVatNumberChange={handleVatNumberChange}
        />
        
        <ActivityCodes 
          atecoCode={safeData.ateco_code}
          naceCode={safeData.nace_code}
          handleSelectChange={handleSelectChange}
        />
        
        <LegalDetails 
          legalForm={safeData.legal_form}
          collectiveAgreement={safeData.collective_agreement}
          handleSelectChange={handleSelectChange}
        />
      </div>

      <MainAddressSection 
        addressData={{
          address_street_type: safeData.address_street_type,
          address_street: safeData.address_street,
          address_number: safeData.address_number,
          address_postal_code: safeData.address_postal_code,
          address_city: safeData.address_city,
          address_province: safeData.address_province
        }}
        onChange={handleAddressChange}
      />

      {showDebugInfo && (
        <div className="mb-6">
          <DatabaseDebugInfo />
        </div>
      )}

      <CompanyOptionsSection 
        isPartOfGroup={safeData.is_part_of_group}
        hasMultipleLocations={safeData.has_multiple_locations}
        onCheckboxChange={handleCheckboxChange}
      />

      {safeData.is_part_of_group && (
        <GroupCompaniesSection 
          groupCompanies={groupCompanies}
          onAddCompany={handleAddGroupCompany}
          onUpdateCompany={handleUpdateGroupCompany}
          onRemoveCompany={handleRemoveGroupCompany}
        />
      )}

      {safeData.has_multiple_locations && (
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
