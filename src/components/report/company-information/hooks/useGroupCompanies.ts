
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase, withRetry } from '@/integrations/supabase/client';
import { GroupCompany } from '../types';

export const useGroupCompanies = (companyId: string | undefined) => {
  const { toast } = useToast();
  const [groupCompanies, setGroupCompanies] = useState<GroupCompany[]>([]);

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
    if (!companyId) return;
    
    try {
      const { data, error } = await withRetry(() => 
        supabase
          .from('group_companies')
          .insert({
            company_id: companyId,
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
    if (!companyId) return;
    
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
    if (!companyId) return;
    
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
    loadGroupCompanies,
    handleAddGroupCompany,
    handleUpdateGroupCompany,
    handleRemoveGroupCompany
  };
};
