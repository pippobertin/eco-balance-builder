
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Company } from '@/context/types';
import { supabase, withRetry } from '@/integrations/supabase/client';
import { CompanyDataState } from './useCompanyInfoState';

export const useCompanyInfoLoading = (
  currentCompany: Company | null,
  setCompanyData: React.Dispatch<React.SetStateAction<CompanyDataState>>
) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const loadingAttemptedRef = useRef(false);

  const loadCompanyDetails = async () => {
    if (!currentCompany || !currentCompany.id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Loading company details for:", currentCompany.id);
      
      const { data, error } = await withRetry(() => 
        supabase
          .from('companies')
          .select('*')
          .eq('id', currentCompany.id)
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
      } else {
        console.error("No company data found for ID:", currentCompany.id);
      }
    } catch (error) {
      console.error('Error loading company details:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare i dettagli aziendali',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentCompany || !currentCompany.id) {
      setIsLoading(false);
      return;
    }
    
    if (loadingAttemptedRef.current) {
      return;
    }
    
    loadingAttemptedRef.current = true;
    loadCompanyDetails();
  }, [currentCompany?.id]);

  return {
    isLoading,
    loadCompanyDetails
  };
};
