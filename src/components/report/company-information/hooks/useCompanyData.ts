
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase, withRetry } from '@/integrations/supabase/client';
import { CompanyDataState, AddressData } from '../types';

export const useCompanyData = (companyId: string | undefined, onSaveCompleted?: () => void) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [companyData, setCompanyData] = useState<CompanyDataState>({
    name: '',
    vat_number: '',
    ateco_code: '',
    nace_code: '',
    legal_form: '',
    collective_agreement: '',
    profile_about: '',
    profile_values: '',
    profile_mission: '',
    profile_vision: '',
    profile_value_chain: '',
    profile_value_creation_factors: '',
    is_part_of_group: false,
    has_multiple_locations: false,
    address_street_type: '',
    address_street: '',
    address_number: '',
    address_postal_code: '',
    address_city: '',
    address_province: ''
  });

  const loadCompanyDetails = async (companyId: string) => {
    try {
      console.log("Loading company details for:", companyId);
      
      const { data, error } = await withRetry(() => 
        supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single()
      );

      if (error) {
        console.error("Error loading company data:", error);
        throw error;
      }

      if (data) {
        console.log("Company data loaded successfully:", data);
        setCompanyData({
          name: data.name || '',
          vat_number: data.vat_number || '',
          ateco_code: data.ateco_code || '',
          nace_code: data.nace_code || '',
          legal_form: data.legal_form || '',
          collective_agreement: data.collective_agreement || '',
          profile_about: data.profile_about || '',
          profile_values: data.profile_values || '',
          profile_mission: data.profile_mission || '',
          profile_vision: data.profile_vision || '',
          profile_value_chain: data.profile_value_chain || '',
          profile_value_creation_factors: data.profile_value_creation_factors || '',
          is_part_of_group: data.is_part_of_group || false,
          has_multiple_locations: data.has_multiple_locations || false,
          address_street_type: data.address_street_type || '',
          address_street: data.address_street || '',
          address_number: data.address_number || '',
          address_postal_code: data.address_postal_code || '',
          address_city: data.address_city || '',
          address_province: data.address_province || ''
        });
        return data;
      } else {
        console.error("No company data found for ID:", companyId);
        return null;
      }
    } catch (error) {
      console.error('Error loading company details:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare i dettagli aziendali',
        variant: 'destructive'
      });
      return null;
    }
  };

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
    if (!companyId) {
      toast({
        title: 'Errore',
        description: 'Nessuna azienda selezionata',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log("Saving company info for:", companyId);
      
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
          .eq('id', companyId)
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
      
      if (onSaveCompleted) {
        onSaveCompleted();
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
    companyData,
    setCompanyData,
    loadCompanyDetails,
    handleInputChange,
    handleSelectChange,
    handleAddressChange,
    handleCheckboxChange,
    saveCompanyInfo,
    isSaving
  };
};
