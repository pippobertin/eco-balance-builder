
import { useToast } from '@/hooks/use-toast';
import { Company } from '@/context/types';
import { supabase, withRetry } from '@/integrations/supabase/client';
import { AddressData } from '../components/address/types';
import { CompanyDataState } from './useCompanyInfoState';

export const useCompanyInfoHandlers = (
  currentCompany: Company | null,
  companyData: CompanyDataState,
  setCompanyData: React.Dispatch<React.SetStateAction<CompanyDataState>>,
  isSaving: boolean,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  onNext?: () => void
) => {
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (data: Partial<AddressData>) => {
    setCompanyData(prev => ({
      ...prev,
      ...data
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCompanyData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const saveCompanyInfo = async () => {
    if (!currentCompany || !currentCompany.id) {
      toast({
        title: 'Errore',
        description: 'Nessuna azienda selezionata',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log("Saving company info for:", currentCompany.id);
      
      const updateData = {
        name: companyData.name,
        vat_number: companyData.vat_number,
        ateco_code: companyData.ateco_code,
        nace_code: companyData.nace_code,
        legal_form: companyData.legal_form,
        collective_agreement: companyData.collective_agreement,
        profile_about: companyData.profile_about,
        profile_values: companyData.profile_values,
        profile_mission: companyData.profile_mission,
        profile_vision: companyData.profile_vision,
        profile_value_chain: companyData.profile_value_chain,
        profile_value_creation_factors: companyData.profile_value_creation_factors,
        is_part_of_group: companyData.is_part_of_group,
        has_multiple_locations: companyData.has_multiple_locations,
        address_street_type: companyData.address_street_type,
        address_street: companyData.address_street,
        address_number: companyData.address_number,
        address_postal_code: companyData.address_postal_code,
        address_city: companyData.address_city,
        address_province: companyData.address_province
      };

      const { error } = await withRetry(() => 
        supabase
          .from('companies')
          .update(updateData)
          .eq('id', currentCompany.id)
      );

      if (error) {
        console.error("Error saving company info:", error);
        throw error;
      }

      console.log("Company info saved successfully");
      toast({
        title: 'Informazioni salvate',
        description: 'Le informazioni aziendali sono state salvate con successo',
      });
      
      if (onNext) {
        onNext();
      }
    } catch (error) {
      console.error('Error saving company information:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile salvare le informazioni aziendali',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleAddressChange,
    saveCompanyInfo
  };
};
