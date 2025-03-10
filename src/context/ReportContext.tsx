
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MaterialityIssue, Stakeholder } from '@/components/report/materiality/types';
import { useToast } from '@/hooks/use-toast';

// Definiamo le interfacce per le aziende e i report
export interface Company {
  id: string;
  name: string;
  vat_number?: string;
  country?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface Report {
  id: string;
  company_id: string;
  report_year: string;
  report_type: string; // A, B, C, D
  is_consolidated: boolean;
  environmental_metrics: any;
  social_metrics: any;
  conduct_metrics: any;
  narrative_pat_metrics?: any;
  materiality_analysis?: any;
  status: string; // draft, published
  created_at?: string;
  updated_at?: string;
}

export interface Subsidiary {
  id?: string;
  report_id?: string;
  name: string;
  location: string;
}

// Define the structure of our report data
export interface ReportData {
  environmentalMetrics: {
    carbonEmissions?: number;
    energyConsumption?: number;
    wasteGeneration?: number;
    waterUsage?: number;
    renewableEnergy?: number;
    scope1Data?: any;
    scope2Data?: any;
    scope3Data?: any;
    totalScope1Emissions?: number;
    totalScope2Emissions?: number;
    totalScope3Emissions?: number;
  };
  socialMetrics: {
    employeeDiversity?: number;
    trainingHours?: number;
    communityEngagement?: number;
    employeeSatisfaction?: number;
  };
  conductMetrics: {
    governanceCompliance?: number;
    policyAdherence?: number;
    riskManagement?: number;
  };
  materialityAnalysis: {
    issues?: MaterialityIssue[];
    stakeholders?: Stakeholder[];
    esgScore?: number;
  };
  narrativePATMetrics?: any;
}

// Default empty report data
const defaultReportData: ReportData = {
  environmentalMetrics: {},
  socialMetrics: {},
  conductMetrics: {},
  materialityAnalysis: {
    issues: [],
    stakeholders: []
  }
};

interface ReportContextType {
  reportData: ReportData;
  updateReportData: (data: Partial<ReportData>) => void;
  resetReportData: () => void;
  companies: Company[];
  reports: Report[];
  currentCompany: Company | null;
  currentReport: Report | null;
  loadCompanies: () => Promise<void>;
  createCompany: (company: Omit<Company, 'id'>) => Promise<string | null>;
  createReport: (report: Omit<Report, 'id' | 'created_at' | 'updated_at'>) => Promise<string | null>;
  loadReports: (companyId: string) => Promise<void>;
  loadReport: (reportId: string) => Promise<void>;
  setCurrentCompany: (company: Company | null) => void;
  setCurrentReport: (report: Report | null) => void;
  saveSubsidiaries: (subsidiaries: Subsidiary[], reportId: string) => Promise<void>;
  saveCurrentReport: () => Promise<void>;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [reportData, setReportData] = useState<ReportData>(defaultReportData);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);

  // Carica le aziende al caricamento del componente
  useEffect(() => {
    loadCompanies();
  }, []);

  // Recupera company e report correnti dal localStorage se disponibili
  useEffect(() => {
    try {
      const savedCompanyId = localStorage.getItem('currentCompanyId');
      const savedReportId = localStorage.getItem('currentReportId');
      
      if (savedCompanyId && savedReportId) {
        // Al caricamento iniziale, recupera azienda e report correnti
        const loadCurrentData = async () => {
          // Carica l'azienda
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('id', savedCompanyId)
            .single();
          
          if (companyError) {
            console.error('Errore nel caricamento dell\'azienda corrente:', companyError);
            return;
          }

          if (companyData) {
            setCurrentCompany(companyData);
            
            // Carica il report
            const { data: reportData, error: reportError } = await supabase
              .from('reports')
              .select('*')
              .eq('id', savedReportId)
              .single();
            
            if (reportError) {
              console.error('Errore nel caricamento del report corrente:', reportError);
              return;
            }

            if (reportData) {
              setCurrentReport(reportData);
              
              // Carica i dati del report
              const newReportData: ReportData = {
                environmentalMetrics: reportData.environmental_metrics || {},
                socialMetrics: reportData.social_metrics || {},
                conductMetrics: reportData.conduct_metrics || {},
                materialityAnalysis: reportData.materiality_analysis || { issues: [], stakeholders: [] },
                narrativePATMetrics: reportData.narrative_pat_metrics || {}
              };
              
              setReportData(newReportData);
            }
          }
        };
        
        loadCurrentData();
      }
    } catch (error) {
      console.error('Errore nel recupero dei dati dal localStorage:', error);
    }
  }, []);

  // Salva gli ID di company e report correnti nel localStorage quando cambiano
  useEffect(() => {
    if (currentCompany) {
      localStorage.setItem('currentCompanyId', currentCompany.id);
    }
    
    if (currentReport) {
      localStorage.setItem('currentReportId', currentReport.id);
    }
  }, [currentCompany, currentReport]);

  // Imposta il flag needsSaving quando i dati del report cambiano
  useEffect(() => {
    if (currentReport) {
      setNeedsSaving(true);
    }
  }, [reportData]);

  // Salvataggio automatico dei dati ogni 30 secondi se ci sono modifiche da salvare
  useEffect(() => {
    if (!needsSaving || !currentReport) return;
    
    const timer = setTimeout(async () => {
      await saveCurrentReport();
      setNeedsSaving(false);
      setLastSaved(new Date());
    }, 30000); // 30 secondi
    
    return () => clearTimeout(timer);
  }, [needsSaving, reportData, currentReport]);

  // Carica le aziende dal database
  const loadCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setCompanies(data || []);
    } catch (error: any) {
      console.error('Errore nel caricamento delle aziende:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile caricare le aziende: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Crea una nuova azienda
  const createCompany = async (company: Omit<Company, 'id'>): Promise<string | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .insert([company])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setCompanies(prev => [...prev, data]);
      toast({
        title: "Successo",
        description: `Azienda ${data.name} creata con successo`,
      });
      
      return data.id;
    } catch (error: any) {
      console.error('Errore nella creazione dell\'azienda:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile creare l'azienda: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Crea un nuovo report
  const createReport = async (report: Omit<Report, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .insert([report])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setReports(prev => [...prev, data]);
      setCurrentReport(data);
      
      // Inizializza i dati del report
      setReportData(defaultReportData);
      
      toast({
        title: "Successo",
        description: `Report creato con successo`,
      });
      
      return data.id;
    } catch (error: any) {
      console.error('Errore nella creazione del report:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile creare il report: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Carica i report di un'azienda
  const loadReports = async (companyId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setReports(data || []);
    } catch (error: any) {
      console.error('Errore nel caricamento dei report:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile caricare i report: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Carica un report specifico
  const loadReport = async (reportId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error) {
        throw error;
      }

      setCurrentReport(data);
      
      // Carica i dati dettagliati del report
      const newReportData: ReportData = {
        environmentalMetrics: data.environmental_metrics || {},
        socialMetrics: data.social_metrics || {},
        conductMetrics: data.conduct_metrics || {},
        materialityAnalysis: data.materiality_analysis || { issues: [], stakeholders: [] },
        narrativePATMetrics: data.narrative_pat_metrics || {}
      };
      
      setReportData(newReportData);
      
      // Carica anche le imprese figlie se il report è consolidato
      if (data.is_consolidated) {
        const { data: subsidiaries, error: subsError } = await supabase
          .from('subsidiaries')
          .select('*')
          .eq('report_id', reportId);
        
        if (!subsError && subsidiaries) {
          // Qui potremmo gestire le imprese figlie se necessario
          console.log("Imprese figlie caricate:", subsidiaries);
        }
      }
    } catch (error: any) {
      console.error('Errore nel caricamento del report:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile caricare il report: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Salva le imprese figlie per un report
  const saveSubsidiaries = async (subsidiaries: Subsidiary[], reportId: string) => {
    try {
      setLoading(true);
      
      // Prima eliminiamo tutte le imprese figlie esistenti per questo report
      await supabase
        .from('subsidiaries')
        .delete()
        .eq('report_id', reportId);
      
      // Poi inseriamo le nuove
      if (subsidiaries.length > 0) {
        const subsToInsert = subsidiaries.map(sub => ({
          report_id: reportId,
          name: sub.name,
          location: sub.location
        }));
        
        const { error } = await supabase
          .from('subsidiaries')
          .insert(subsToInsert);
          
        if (error) throw error;
      }
      
      toast({
        title: "Successo",
        description: `Imprese figlie salvate con successo`,
      });
    } catch (error: any) {
      console.error('Errore nel salvataggio delle imprese figlie:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile salvare le imprese figlie: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Salva il report corrente nel database
  const saveCurrentReport = async () => {
    if (!currentReport) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('reports')
        .update({
          environmental_metrics: reportData.environmentalMetrics,
          social_metrics: reportData.socialMetrics,
          conduct_metrics: reportData.conductMetrics,
          materiality_analysis: reportData.materialityAnalysis,
          narrative_pat_metrics: reportData.narrativePATMetrics,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentReport.id);
        
      if (error) throw error;
      
      console.log("Report salvato nel database con successo");
      setNeedsSaving(false);
      setLastSaved(new Date());
    } catch (error: any) {
      console.error('Errore nel salvataggio del report:', error.message);
      // Non mostriamo notifiche qui per evitare spam durante i salvataggi automatici
    } finally {
      setLoading(false);
    }
  };

  const updateReportData = (newData: Partial<ReportData>) => {
    setReportData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData,
        environmentalMetrics: {
          ...prevData.environmentalMetrics,
          ...(newData.environmentalMetrics || {})
        },
        socialMetrics: {
          ...prevData.socialMetrics,
          ...(newData.socialMetrics || {})
        },
        conductMetrics: {
          ...prevData.conductMetrics,
          ...(newData.conductMetrics || {})
        },
        materialityAnalysis: {
          ...prevData.materialityAnalysis,
          ...(newData.materialityAnalysis || {})
        }
      };
      
      console.log("Dati del report aggiornati:", updatedData);
      return updatedData;
    });
  };

  const resetReportData = () => {
    setReportData(defaultReportData);
  };

  return (
    <ReportContext.Provider value={{ 
      reportData, 
      updateReportData, 
      resetReportData,
      companies,
      reports,
      currentCompany,
      currentReport,
      loadCompanies,
      createCompany,
      createReport,
      loadReports,
      loadReport,
      setCurrentCompany,
      setCurrentReport,
      saveSubsidiaries,
      saveCurrentReport
    }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};
