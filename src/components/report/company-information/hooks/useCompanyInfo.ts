
import { useCompanyInfoState } from './useCompanyInfoState';
import { useCompanyInfoLoading } from './useCompanyInfoLoading';
import { useCompanyInfoHandlers } from './useCompanyInfoHandlers';
import { useGroupCompanies } from './useGroupCompanies';
import { useCompanyLocations } from './useCompanyLocations';
import { Company } from '@/context/types';

export const useCompanyInfo = (currentCompany: Company | null, onNext?: () => void) => {
  const { 
    companyData, 
    setCompanyData,
    isSaving, 
    setIsSaving 
  } = useCompanyInfoState();

  const {
    isLoading,
    loadCompanyDetails
  } = useCompanyInfoLoading(currentCompany, setCompanyData);

  const { 
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleAddressChange,
    saveCompanyInfo
  } = useCompanyInfoHandlers(
    currentCompany,
    companyData,
    setCompanyData,
    isSaving,
    setIsSaving,
    onNext
  );

  const {
    groupCompanies,
    handleAddGroupCompany,
    handleUpdateGroupCompany, 
    handleRemoveGroupCompany
  } = useGroupCompanies(currentCompany);

  const {
    companyLocations,
    handleAddLocation,
    handleUpdateLocation,
    handleRemoveLocation
  } = useCompanyLocations(currentCompany);

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
