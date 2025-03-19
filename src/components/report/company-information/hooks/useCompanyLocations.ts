
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Company } from '@/context/types';
import { supabase, withRetry } from '@/integrations/supabase/client';
import { CompanyLocation } from '../CompanyGeneralInfo';

export const useCompanyLocations = (currentCompany: Company | null) => {
  const { toast } = useToast();
  const [companyLocations, setCompanyLocations] = useState<CompanyLocation[]>([]);

  useEffect(() => {
    if (currentCompany?.id && currentCompany.has_multiple_locations) {
      loadCompanyLocations(currentCompany.id);
    }
  }, [currentCompany?.id]);

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

  const handleAddLocation = async (location: CompanyLocation) => {
    if (!currentCompany || !currentCompany.id) return;
    
    try {
      const { data, error } = await withRetry(() => 
        supabase
          .from('company_locations')
          .insert({
            company_id: currentCompany.id,
            location_type: location.location_type,
            address_street_type: location.address_street_type,
            address_street: location.address_street,
            address_number: location.address_number,
            address_postal_code: location.address_postal_code,
            address_city: location.address_city,
            address_province: location.address_province
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
            location_type: location.location_type,
            address_street_type: location.address_street_type,
            address_street: location.address_street,
            address_number: location.address_number,
            address_postal_code: location.address_postal_code,
            address_city: location.address_city,
            address_province: location.address_province
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

  return {
    companyLocations,
    handleAddLocation,
    handleUpdateLocation,
    handleRemoveLocation
  };
};
