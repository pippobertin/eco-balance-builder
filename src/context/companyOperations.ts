
import { supabase, withRetry } from '@/integrations/supabase/client';
import { Company } from './types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useCompanyOperations = () => {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  // Load companies from the database - for admins, this loads all companies
  // for regular users, this loads only their companies
  const loadCompanies = async (): Promise<Company[]> => {
    try {
      if (!user) {
        return [];
      }

      console.log("Loading companies for user", user.id, "isAdmin:", isAdmin);
      
      return await withRetry(async () => {
        let query = supabase
          .from('companies')
          .select('*');
        
        // If not admin, only load companies created by the current user
        if (!isAdmin) {
          query = query.eq('created_by', user.id);
        }
        
        // Add order by at the end
        query = query.order('name');

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        console.log("Companies loaded:", data?.length || 0);
        return data || [];
      });
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
      if (!user) {
        throw new Error('User must be logged in to create a company');
      }

      return await withRetry(async () => {
        const { data, error } = await supabase
          .from('companies')
          .insert([{ ...company, created_by: user.id }])
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
      });
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
      return await withRetry(async () => {
        // For admins, load any company, for regular users, ensure they can only load their own companies
        let query = supabase.from('companies').select('*').eq('id', companyId);
        
        if (!isAdmin && user) {
          query = query.eq('created_by', user.id);
        }
        
        const { data, error } = await query.maybeSingle();
        
        if (error) {
          console.error('Error loading company by ID:', error);
          return null;
        }

        return data;
      });
    } catch (error) {
      console.error('Error loading company:', error);
      return null;
    }
  };

  return { loadCompanies, createCompany, loadCompanyById };
};
