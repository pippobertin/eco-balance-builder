
import { supabase, withRetry } from '@/integrations/supabase/client';
import { Company } from './types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

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
        // Fix: Add the created_by to the company object directly before inserting
        const companyWithCreator = { 
          ...company, 
          created_by: user.id 
        };

        // Fix: Make sure we're passing a properly formatted object in an array
        const { data, error } = await supabase
          .from('companies')
          .insert([companyWithCreator])
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

  // Delete a company from the database
  const deleteCompany = async (companyId: string): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User must be logged in to delete a company');
      }

      return await withRetry(async () => {
        // Check if the user has permission to delete this company
        let query = supabase
          .from('companies')
          .select('*')
          .eq('id', companyId);
        
        if (!isAdmin) {
          query = query.eq('created_by', user.id);
        }
        
        const { data: company, error: accessError } = await query.single();
        
        if (accessError || !company) {
          throw new Error('You do not have permission to delete this company');
        }
        
        // Delete all reports associated with this company
        const { data: reports } = await supabase
          .from('reports')
          .select('id')
          .eq('company_id', companyId);
          
        if (reports && reports.length > 0) {
          // Delete subsidiaries for each report
          for (const report of reports) {
            await supabase
              .from('subsidiaries')
              .delete()
              .eq('report_id', report.id);
          }
          
          // Delete the reports
          await supabase
            .from('reports')
            .delete()
            .eq('company_id', companyId);
        }
        
        // Delete group companies associated with this company
        await supabase
          .from('group_companies')
          .delete()
          .eq('company_id', companyId);
          
        // Delete company locations
        await supabase
          .from('company_locations')
          .delete()
          .eq('company_id', companyId);
        
        // Finally, delete the company itself
        const { error } = await supabase
          .from('companies')
          .delete()
          .eq('id', companyId);
          
        if (error) throw error;
        
        toast({
          title: "Successo",
          description: "Azienda eliminata con successo",
        });
        
        return true;
      });
    } catch (error: any) {
      console.error('Error deleting company:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile eliminare l'azienda: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }
  };

  return { loadCompanies, createCompany, loadCompanyById, deleteCompany };
};
