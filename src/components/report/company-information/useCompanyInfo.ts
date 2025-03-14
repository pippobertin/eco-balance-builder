
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Company } from '@/context/types';
import { supabase, withRetry } from '@/integrations/supabase/client';

interface CompanyDataState {
  name: string;
  vat_number: string;
  ateco_code: string;
  nace_code: string;
  legal_form: string;
  collective_agreement: string;
  profile_about: string;
  profile_values: string;
  profile_mission: string;
  profile_vision: string;
  profile_value_chain: string;
  profile_value_creation_factors: string;
}

export const useCompanyInfo = (currentCompany: Company | null, onNext?: () => void) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loadingAttemptedRef = useRef(false);
  
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
    profile_value_creation_factors: ''
  });

  useEffect(() => {
    // Reset loading state when component mounts or currentCompany changes
    if (!currentCompany || !currentCompany.id) {
      setIsLoading(false);
      return;
    }
    
    // Prevent duplicate loading
    if (loadingAttemptedRef.current && companyData.name) {
      return;
    }
    
    setIsLoading(true);
    loadingAttemptedRef.current = true;
    
    // Load the company data
    const loadCompanyDetails = async () => {
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
            profile_value_creation_factors: data.profile_value_creation_factors || ''
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

    loadCompanyDetails();
  }, [currentCompany?.id]);

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
      
      // Now that we've added all the necessary columns to the database, 
      // we can directly save all the data without checking for column existence
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
        profile_value_creation_factors: companyData.profile_value_creation_factors
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
      
      // Only proceed to next step if callback provided
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
    companyData,
    handleInputChange,
    handleSelectChange,
    saveCompanyInfo,
    isSaving,
    isLoading
  };
};
