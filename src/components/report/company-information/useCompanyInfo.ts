
import { useState, useEffect, useRef } from 'react';
import { Company } from '@/context/types';
import { ensureLocationDataLoaded } from './utils/locationUtils';
import { useCompanyData } from './hooks/useCompanyData';
import { useGroupCompanies } from './hooks/useGroupCompanies';
import { useCompanyLocations } from './hooks/useCompanyLocations';
import { AddressData } from './components/AddressFields';

export const useCompanyInfo = (currentCompany: Company | null, onNext?: () => void) => {
  const [isLoading, setIsLoading] = useState(true);
  const loadingAttemptedRef = useRef(false);
  
  // Initialize our custom hooks
  const { 
    companyData, 
    loadCompanyDetails,
    handleInputChange,
    handleSelectChange,
    handleAddressChange,
    handleCheckboxChange,
    saveCompanyInfo,
    isSaving
  } = useCompanyData(currentCompany?.id, onNext);
  
  const {
    groupCompanies,
    loadGroupCompanies,
    handleAddGroupCompany,
    handleUpdateGroupCompany,
    handleRemoveGroupCompany
  } = useGroupCompanies(currentCompany?.id);
  
  const {
    companyLocations,
    loadCompanyLocations,
    handleAddLocation,
    handleUpdateLocation,
    handleRemoveLocation
  } = useCompanyLocations(currentCompany?.id);

  useEffect(() => {
    if (!currentCompany || !currentCompany.id) {
      setIsLoading(false);
      return;
    }
    
    if (loadingAttemptedRef.current && companyData.name) {
      return;
    }
    
    setIsLoading(true);
    loadingAttemptedRef.current = true;
    
    const loadData = async () => {
      await ensureLocationDataLoaded();
      const companyDetails = await loadCompanyDetails(currentCompany.id);
      
      if (companyDetails) {
        if (companyDetails.is_part_of_group) {
          loadGroupCompanies(currentCompany.id);
        }
        
        if (companyDetails.has_multiple_locations) {
          loadCompanyLocations(currentCompany.id);
        }
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [currentCompany?.id]);

  return {
    companyData,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleAddressChange,
    saveCompanyInfo,
    isSaving,
    isLoading,
    groupCompanies,
    companyLocations,
    handleAddGroupCompany,
    handleUpdateGroupCompany,
    handleRemoveGroupCompany,
    handleAddLocation,
    handleUpdateLocation,
    handleRemoveLocation
  };
};
