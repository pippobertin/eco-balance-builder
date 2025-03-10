
import { supabase } from '@/integrations/supabase/client';
import { Company } from './types';
import { useToast } from '@/hooks/use-toast';

export const useCompanyOperations = () => {
  const { toast } = useToast();

  // Load companies from the database
  const loadCompanies = async (): Promise<Company[]> => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error: any) {
      console.error('Error loading companies:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile caricare le aziende: ${error.message}`,
        variant: "destructive"
      });
      return [];
    }
  };

  // Create a new company
  const createCompany = async (company: Omit<Company, 'id'>): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([company])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Successo",
        description: `Azienda ${data.name} creata con successo`,
      });
      
      return data.id;
    } catch (error: any) {
      console.error('Error creating company:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile creare l'azienda: ${error.message}`,
        variant: "destructive"
      });
      return null;
    }
  };

  // Load a specific company by ID
  const loadCompanyById = async (companyId: string): Promise<Company | null> => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();
      
      if (error) {
        console.error('Error loading company by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error loading company:', error);
      return null;
    }
  };

  return { loadCompanies, createCompany, loadCompanyById };
};
