
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Company } from '@/context/types';
import { supabase, withRetry } from '@/integrations/supabase/client';
import { GroupCompany } from '../CompanyGeneralInfo';

export const useGroupCompanies = (currentCompany: Company | null) => {
  const { toast } = useToast();
  const [groupCompanies, setGroupCompanies] = useState<GroupCompany[]>([]);

  useEffect(() => {
    if (currentCompany?.id && currentCompany.is_part_of_group) {
      loadGroupCompanies(currentCompany.id);
    }
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

  const handleAddGroupCompany = async (company: GroupCompany) => {
    if (!currentCompany || !currentCompany.id) return;
    
    try {
      const { data, error } = await withRetry(() => 
        supabase
          .from('group_companies')
          .insert({
            company_id: currentCompany.id,
            name: company.name,
            relationship_type: company.relationship_type,
            address_street_type: company.address_street_type,
            address_street: company.address_street,
            address_number: company.address_number,
            address_postal_code: company.address_postal_code,
            address_city: company.address_city,
            address_province: company.address_province
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
            relationship_type: company.relationship_type,
            address_street_type: company.address_street_type,
            address_street: company.address_street,
            address_number: company.address_number,
            address_postal_code: company.address_postal_code,
            address_city: company.address_city,
            address_province: company.address_province
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

  return {
    groupCompanies,
    handleAddGroupCompany,
    handleUpdateGroupCompany,
    handleRemoveGroupCompany
  };
};
