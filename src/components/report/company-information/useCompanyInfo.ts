
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Company } from '@/context/types';
import { supabase, withRetry } from '@/integrations/supabase/client';
import { GroupCompany, CompanyLocation } from './CompanyGeneralInfo';

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
  is_part_of_group: boolean;
  has_multiple_locations: boolean;
}

export const useCompanyInfo = (currentCompany: Company | null, onNext?: () => void) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loadingAttemptedRef = useRef(false);
  const [groupCompanies, setGroupCompanies] = useState<GroupCompany[]>([]);
  const [companyLocations, setCompanyLocations] = useState<CompanyLocation[]>([]);
  
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
    has_multiple_locations: false
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
            profile_value_creation_factors: data.profile_value_creation_factors || '',
            is_part_of_group: data.is_part_of_group || false,
            has_multiple_locations: data.has_multiple_locations || false
          });

          // Load group companies if is_part_of_group is true
          if (data.is_part_of_group) {
            loadGroupCompanies(currentCompany.id);
          }
          
          // Load company locations if has_multiple_locations is true
          if (data.has_multiple_locations) {
            loadCompanyLocations(currentCompany.id);
          }
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

  const loadGroupCompanies = async (companyId: string) => {
    try {
      console.log("Loading group companies for:", companyId);
      
      const { data, error } = await withRetry(() => 
        supabase
          .from('group_companies')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: true })
      );

      if (error) {
        console.error("Error loading group companies:", error);
        throw error;
      }

      if (data) {
        console.log("Group companies loaded successfully:", data);
        setGroupCompanies(data);
      }
    } catch (error) {
      console.error('Error loading group companies:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare le aziende del gruppo',
        variant: 'destructive'
      });
    }
  };

  const loadCompanyLocations = async (companyId: string) => {
    try {
      console.log("Loading company locations for:", companyId);
      
      const { data, error } = await withRetry(() => 
        supabase
          .from('company_locations')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: true })
      );

      if (error) {
        console.error("Error loading company locations:", error);
        throw error;
      }

      if (data) {
        console.log("Company locations loaded successfully:", data);
        setCompanyLocations(data);
      }
    } catch (error) {
      console.error('Error loading company locations:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare le sedi dell\'azienda',
        variant: 'destructive'
      });
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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCompanyData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Group companies handlers
  const handleAddGroupCompany = async (company: GroupCompany) => {
    if (!currentCompany || !currentCompany.id) return;
    
    try {
      const { data, error } = await withRetry(() => 
        supabase
          .from('group_companies')
          .insert({
            company_id: currentCompany.id,
            name: company.name,
            address: company.address,
            relationship_type: company.relationship_type
          })
          .select('*')
          .single()
      );

      if (error) {
        console.error("Error adding group company:", error);
        throw error;
      }

      if (data) {
        setGroupCompanies(prev => [...prev, data]);
        toast({
          title: 'Azienda aggiunta',
          description: 'Azienda del gruppo aggiunta con successo',
        });
      }
    } catch (error) {
      console.error('Error adding group company:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile aggiungere l\'azienda del gruppo',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateGroupCompany = async (index: number, company: GroupCompany) => {
    if (!currentCompany || !currentCompany.id) return;
    
    const updatedCompany = groupCompanies[index];
    if (!updatedCompany || !updatedCompany.id) return;
    
    try {
      const { error } = await withRetry(() => 
        supabase
          .from('group_companies')
          .update({
            name: company.name,
            address: company.address,
            relationship_type: company.relationship_type
          })
          .eq('id', updatedCompany.id)
      );

      if (error) {
        console.error("Error updating group company:", error);
        throw error;
      }

      const updatedCompanies = [...groupCompanies];
      updatedCompanies[index] = { ...company, id: updatedCompany.id };
      setGroupCompanies(updatedCompanies);
      
      toast({
        title: 'Azienda aggiornata',
        description: 'Azienda del gruppo aggiornata con successo',
      });
    } catch (error) {
      console.error('Error updating group company:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile aggiornare l\'azienda del gruppo',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveGroupCompany = async (index: number) => {
    if (!currentCompany || !currentCompany.id) return;
    
    const removedCompany = groupCompanies[index];
    if (!removedCompany || !removedCompany.id) {
      // If the company doesn't have an ID, it was added locally but not saved to the database
      setGroupCompanies(prev => prev.filter((_, i) => i !== index));
      return;
    }
    
    try {
      const { error } = await withRetry(() => 
        supabase
          .from('group_companies')
          .delete()
          .eq('id', removedCompany.id)
      );

      if (error) {
        console.error("Error removing group company:", error);
        throw error;
      }

      setGroupCompanies(prev => prev.filter((_, i) => i !== index));
      
      toast({
        title: 'Azienda rimossa',
        description: 'Azienda del gruppo rimossa con successo',
      });
    } catch (error) {
      console.error('Error removing group company:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile rimuovere l\'azienda del gruppo',
        variant: 'destructive'
      });
    }
  };

  // Company locations handlers
  const handleAddLocation = async (location: CompanyLocation) => {
    if (!currentCompany || !currentCompany.id) return;
    
    try {
      const { data, error } = await withRetry(() => 
        supabase
          .from('company_locations')
          .insert({
            company_id: currentCompany.id,
            address: location.address,
            location_type: location.location_type
          })
          .select('*')
          .single()
      );

      if (error) {
        console.error("Error adding company location:", error);
        throw error;
      }

      if (data) {
        setCompanyLocations(prev => [...prev, data]);
        toast({
          title: 'Sede aggiunta',
          description: 'Sede dell\'azienda aggiunta con successo',
        });
      }
    } catch (error) {
      console.error('Error adding company location:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile aggiungere la sede dell\'azienda',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateLocation = async (index: number, location: CompanyLocation) => {
    if (!currentCompany || !currentCompany.id) return;
    
    const updatedLocation = companyLocations[index];
    if (!updatedLocation || !updatedLocation.id) return;
    
    try {
      const { error } = await withRetry(() => 
        supabase
          .from('company_locations')
          .update({
            address: location.address,
            location_type: location.location_type
          })
          .eq('id', updatedLocation.id)
      );

      if (error) {
        console.error("Error updating company location:", error);
        throw error;
      }

      const updatedLocations = [...companyLocations];
      updatedLocations[index] = { ...location, id: updatedLocation.id };
      setCompanyLocations(updatedLocations);
      
      toast({
        title: 'Sede aggiornata',
        description: 'Sede dell\'azienda aggiornata con successo',
      });
    } catch (error) {
      console.error('Error updating company location:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile aggiornare la sede dell\'azienda',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveLocation = async (index: number) => {
    if (!currentCompany || !currentCompany.id) return;
    
    const removedLocation = companyLocations[index];
    if (!removedLocation || !removedLocation.id) {
      // If the location doesn't have an ID, it was added locally but not saved to the database
      setCompanyLocations(prev => prev.filter((_, i) => i !== index));
      return;
    }
    
    try {
      const { error } = await withRetry(() => 
        supabase
          .from('company_locations')
          .delete()
          .eq('id', removedLocation.id)
      );

      if (error) {
        console.error("Error removing company location:", error);
        throw error;
      }

      setCompanyLocations(prev => prev.filter((_, i) => i !== index));
      
      toast({
        title: 'Sede rimossa',
        description: 'Sede dell\'azienda rimossa con successo',
      });
    } catch (error) {
      console.error('Error removing company location:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile rimuovere la sede dell\'azienda',
        variant: 'destructive'
      });
    }
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
      
      // Update company data
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
        has_multiple_locations: companyData.has_multiple_locations
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
    handleCheckboxChange,
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
