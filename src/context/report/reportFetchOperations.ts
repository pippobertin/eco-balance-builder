
import { supabase } from '@/integrations/supabase/client';
import { Report } from '@/context/types';
import { safeJsonParse, safeJsonStringify, prepareJsonForDb } from '@/integrations/supabase/utils/jsonUtils';

// Function to create a new report
export const createReport = async (report: Omit<Report, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([
        {
          company_id: report.company_id,
          report_year: report.report_year,
          report_type: report.report_type,
          is_consolidated: report.is_consolidated,
          status: report.status || 'draft',
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    return data.id;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

// Function to delete a report
export const deleteReport = async (reportId: string) => {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting report:', error);
    return false;
  }
};

// Function to fetch all reports for a company
export const fetchReports = async (companyId: string) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

// Function to fetch a specific report
export const fetchReport = async (reportId: string) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
};

// Function to fetch subsidiaries for a report
export const fetchSubsidiaries = async (reportId: string) => {
  try {
    const { data, error } = await supabase
      .from('subsidiaries')
      .select('*')
      .eq('report_id', reportId);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching subsidiaries:', error);
    return [];
  }
};

// Function to save subsidiaries for a report
export const saveSubsidiaries = async (subsidiaries: any[], reportId: string) => {
  try {
    // First delete existing subsidiaries
    const { error: deleteError } = await supabase
      .from('subsidiaries')
      .delete()
      .eq('report_id', reportId);
    
    if (deleteError) throw deleteError;
    
    // Then insert new subsidiaries
    if (subsidiaries.length > 0) {
      const subsidiariesToInsert = subsidiaries.map(subsidiary => ({
        report_id: reportId,
        name: subsidiary.name,
        location: subsidiary.location
      }));
      
      const { error: insertError } = await supabase
        .from('subsidiaries')
        .insert(subsidiariesToInsert);
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving subsidiaries:', error);
    return false;
  }
};

// Function to update a report's environmental metrics
export const updateReportEnvironmentalMetrics = async (reportId: string, metrics: any) => {
  try {
    const environmentalMetrics = prepareJsonForDb(metrics);
    
    const { error } = await supabase
      .from('reports')
      .update({
        environmental_metrics: environmentalMetrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating environmental metrics:', error);
    return false;
  }
};

// Function to update a report's social metrics
export const updateReportSocialMetrics = async (reportId: string, metrics: any) => {
  try {
    const socialMetrics = prepareJsonForDb(metrics);
    
    const { error } = await supabase
      .from('reports')
      .update({
        social_metrics: socialMetrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating social metrics:', error);
    return false;
  }
};

// Function to update a report's conduct metrics
export const updateReportConductMetrics = async (reportId: string, metrics: any) => {
  try {
    const conductMetrics = prepareJsonForDb(metrics);
    
    const { error } = await supabase
      .from('reports')
      .update({
        conduct_metrics: conductMetrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating conduct metrics:', error);
    return false;
  }
};

// Function to update a report's materiality analysis
export const updateReportMaterialityAnalysis = async (reportId: string, analysis: any) => {
  try {
    const materialityAnalysis = prepareJsonForDb(analysis);
    
    const { error } = await supabase
      .from('reports')
      .update({
        materiality_analysis: materialityAnalysis,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating materiality analysis:', error);
    return false;
  }
};

// Function to update a report's status
export const updateReportStatus = async (reportId: string, status: string) => {
  try {
    const { error } = await supabase
      .from('reports')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating report status:', error);
    return false;
  }
};
