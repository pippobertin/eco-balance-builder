
import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { useReport } from '@/hooks/use-report-context';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Import all BP components
import BP1RevenueSectors from './BP1RevenueSectors';
import BP2GenderDiversity from './BP2GenderDiversity';
import BP3GHGTargets from './BP3GHGTargets';
import BP4TransitionPlan from './BP4TransitionPlan';
import BP5PhysicalRisks from './BP5PhysicalRisks';
import BP6HazardousWaste from './BP6HazardousWaste';
import BP7PolicyAlignment from './BP7PolicyAlignment';
import BP8ComplianceProcesses from './BP8ComplianceProcesses';
import BP9Violations from './BP9Violations';
import BP10WorkLifeBalance from './BP10WorkLifeBalance';
import BP11Apprentices from './BP11Apprentices';

// Import form data types
import { 
  BP1FormData, 
  BP2FormData, 
  BP3FormData, 
  BP4FormData, 
  BP5FormData,
  BP6FormData,
  BP7FormData,
  BP8FormData,
  BP9FormData,
  BP10FormData,
  BP11FormData
} from './hooks/types';

interface TabDefinition {
  id: string;
  name: string;
}

const tabs: TabDefinition[] = [
  { id: 'bp1', name: 'BP1 - Settori Specifici' },
  { id: 'bp2', name: 'BP2 - Diversità di Genere' },
  { id: 'bp3', name: 'BP3 - Obiettivi GHG' },
  { id: 'bp4', name: 'BP4 - Piano Transizione' },
  { id: 'bp5', name: 'BP5 - Rischi Fisici' },
  { id: 'bp6', name: 'BP6 - Rifiuti Pericolosi' },
  { id: 'bp7', name: 'BP7 - Allineamento Politiche' },
  { id: 'bp8', name: 'BP8 - Processi Compliance' },
  { id: 'bp9', name: 'BP9 - Violazioni' },
  { id: 'bp10', name: 'BP10 - Equilibrio Lavoro-Vita' },
  { id: 'bp11', name: 'BP11 - Apprendisti' }
];

interface BusinessPartnersMetricsProps {
  activeField?: string;
}

const BusinessPartnersMetrics: React.FC<BusinessPartnersMetricsProps> = ({ activeField }) => {
  const { currentReport } = useReport();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // State for each BP form
  const [bp1FormData, setBp1FormData] = useState<BP1FormData>({});
  const [bp2FormData, setBp2FormData] = useState<BP2FormData>({});
  const [bp3FormData, setBp3FormData] = useState<BP3FormData>({});
  const [bp4FormData, setBp4FormData] = useState<BP4FormData>({});
  const [bp5FormData, setBp5FormData] = useState<BP5FormData>({});
  const [bp6FormData, setBp6FormData] = useState<BP6FormData>({});
  const [bp7FormData, setBp7FormData] = useState<BP7FormData>({});
  const [bp8FormData, setBp8FormData] = useState<BP8FormData>({});
  const [bp9FormData, setBp9FormData] = useState<BP9FormData>({});
  const [bp10FormData, setBp10FormData] = useState<BP10FormData>({});
  const [bp11FormData, setBp11FormData] = useState<BP11FormData>({});

  // State for tracking saves
  const [bp1IsLoading, setBp1IsLoading] = useState(false);
  const [bp2IsLoading, setBp2IsLoading] = useState(false);
  const [bp3IsLoading, setBp3IsLoading] = useState(false);
  const [bp4IsLoading, setBp4IsLoading] = useState(false);
  const [bp5IsLoading, setBp5IsLoading] = useState(false);
  const [bp6IsLoading, setBp6IsLoading] = useState(false);
  const [bp7IsLoading, setBp7IsLoading] = useState(false);
  const [bp8IsLoading, setBp8IsLoading] = useState(false);
  const [bp9IsLoading, setBp9IsLoading] = useState(false);
  const [bp10IsLoading, setBp10IsLoading] = useState(false);
  const [bp11IsLoading, setBp11IsLoading] = useState(false);

  // State for last saved
  const [bp1LastSaved, setBp1LastSaved] = useState<Date | null>(null);
  const [bp2LastSaved, setBp2LastSaved] = useState<Date | null>(null);
  const [bp3LastSaved, setBp3LastSaved] = useState<Date | null>(null);
  const [bp4LastSaved, setBp4LastSaved] = useState<Date | null>(null);
  const [bp5LastSaved, setBp5LastSaved] = useState<Date | null>(null);
  const [bp6LastSaved, setBp6LastSaved] = useState<Date | null>(null);
  const [bp7LastSaved, setBp7LastSaved] = useState<Date | null>(null);
  const [bp8LastSaved, setBp8LastSaved] = useState<Date | null>(null);
  const [bp9LastSaved, setBp9LastSaved] = useState<Date | null>(null);
  const [bp10LastSaved, setBp10LastSaved] = useState<Date | null>(null);
  const [bp11LastSaved, setBp11LastSaved] = useState<Date | null>(null);

  // State for needs saving
  const [bp1NeedsSaving, setBp1NeedsSaving] = useState(false);
  const [bp2NeedsSaving, setBp2NeedsSaving] = useState(false);
  const [bp3NeedsSaving, setBp3NeedsSaving] = useState(false);
  const [bp4NeedsSaving, setBp4NeedsSaving] = useState(false);
  const [bp5NeedsSaving, setBp5NeedsSaving] = useState(false);
  const [bp6NeedsSaving, setBp6NeedsSaving] = useState(false);
  const [bp7NeedsSaving, setBp7NeedsSaving] = useState(false);
  const [bp8NeedsSaving, setBp8NeedsSaving] = useState(false);
  const [bp9NeedsSaving, setBp9NeedsSaving] = useState(false);
  const [bp10NeedsSaving, setBp10NeedsSaving] = useState(false);
  const [bp11NeedsSaving, setBp11NeedsSaving] = useState(false);
  
  // Effect for setting the tab index based on activeField
  useEffect(() => {
    if (activeField) {
      const index = tabs.findIndex(tab => tab.id === activeField);
      if (index !== -1) {
        setSelectedIndex(index);
      }
    }
  }, [activeField]);

  // Save functions for each BP
  const saveBp1Data = async (): Promise<boolean> => {
    if (!currentReport?.id) {
      toast.error("ID report mancante. Impossibile salvare.");
      return false;
    }
    
    setBp1IsLoading(true);
    try {
      const { error } = await supabase
        .from('bp1_revenue_sectors')
        .upsert({
          report_id: currentReport.id,
          ...bp1FormData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP1 data:", error);
        toast.error("Errore durante il salvataggio dei dati");
        return false;
      }
      
      setBp1LastSaved(new Date());
      setBp1NeedsSaving(false);
      toast.success("Dati settori di ricavo salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP1 data:", error);
      toast.error("Si è verificato un errore durante il salvataggio");
      return false;
    } finally {
      setBp1IsLoading(false);
    }
  };

  const saveBp2Data = async (): Promise<boolean> => {
    if (!currentReport?.id) {
      toast.error("ID report mancante. Impossibile salvare.");
      return false;
    }
    
    setBp2IsLoading(true);
    try {
      const { error } = await supabase
        .from('bp2_gender_diversity')
        .upsert({
          report_id: currentReport.id,
          ...bp2FormData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP2 data:", error);
        toast.error("Errore durante il salvataggio dei dati");
        return false;
      }
      
      setBp2LastSaved(new Date());
      setBp2NeedsSaving(false);
      toast.success("Dati diversità di genere salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP2 data:", error);
      toast.error("Si è verificato un errore durante il salvataggio");
      return false;
    } finally {
      setBp2IsLoading(false);
    }
  };

  const saveBp3Data = async (): Promise<boolean> => {
    if (!currentReport?.id) {
      toast.error("ID report mancante. Impossibile salvare.");
      return false;
    }
    
    setBp3IsLoading(true);
    try {
      const { error } = await supabase
        .from('bp3_ghg_targets')
        .upsert({
          report_id: currentReport.id,
          ...bp3FormData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP3 data:", error);
        toast.error("Errore durante il salvataggio dei dati");
        return false;
      }
      
      setBp3LastSaved(new Date());
      setBp3NeedsSaving(false);
      toast.success("Dati obiettivi GHG salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP3 data:", error);
      toast.error("Si è verificato un errore durante il salvataggio");
      return false;
    } finally {
      setBp3IsLoading(false);
    }
  };

  const saveBp4Data = async (): Promise<boolean> => {
    if (!currentReport?.id) {
      toast.error("ID report mancante. Impossibile salvare.");
      return false;
    }
    
    setBp4IsLoading(true);
    try {
      const { error } = await supabase
        .from('bp4_transition_plan')
        .upsert({
          report_id: currentReport.id,
          ...bp4FormData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP4 data:", error);
        toast.error("Errore durante il salvataggio dei dati");
        return false;
      }
      
      setBp4LastSaved(new Date());
      setBp4NeedsSaving(false);
      toast.success("Dati piano transizione salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP4 data:", error);
      toast.error("Si è verificato un errore durante il salvataggio");
      return false;
    } finally {
      setBp4IsLoading(false);
    }
  };

  const saveBp5Data = async (): Promise<boolean> => {
    if (!currentReport?.id) {
      toast.error("ID report mancante. Impossibile salvare.");
      return false;
    }
    
    setBp5IsLoading(true);
    try {
      const { error } = await supabase
        .from('bp5_physical_risks')
        .upsert({
          report_id: currentReport.id,
          has_physical_climate_risks: bp5FormData.hasPhysicalClimateRisks,
          assets_at_risk_amount: bp5FormData.assetsAtRiskAmount,
          assets_at_risk_percentage: bp5FormData.assetsAtRiskPercentage,
          adaptation_coverage: bp5FormData.adaptationCoverage,
          revenue_at_risk_percentage: bp5FormData.revenueAtRiskPercentage,
          risk_assets_location: bp5FormData.riskAssetsLocation,
          real_estate_energy_efficiency: bp5FormData.realEstateEnergyEfficiency,
          updated_at: new Date().toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP5 data:", error);
        toast.error("Errore durante il salvataggio dei dati");
        return false;
      }
      
      setBp5LastSaved(new Date());
      setBp5NeedsSaving(false);
      toast.success("Dati rischi fisici salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP5 data:", error);
      toast.error("Si è verificato un errore durante il salvataggio");
      return false;
    } finally {
      setBp5IsLoading(false);
    }
  };

  const saveBp6Data = async (): Promise<boolean> => {
    if (!currentReport?.id) {
      toast.error("ID report mancante. Impossibile salvare.");
      return false;
    }
    
    setBp6IsLoading(true);
    try {
      const { error } = await supabase
        .from('bp6_hazardous_waste')
        .upsert({
          report_id: currentReport.id,
          ...bp6FormData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP6 data:", error);
        toast.error("Errore durante il salvataggio dei dati");
        return false;
      }
      
      setBp6LastSaved(new Date());
      setBp6NeedsSaving(false);
      toast.success("Dati rifiuti pericolosi salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP6 data:", error);
      toast.error("Si è verificato un errore durante il salvataggio");
      return false;
    } finally {
      setBp6IsLoading(false);
    }
  };

  const saveBp7Data = async (): Promise<boolean> => {
    if (!currentReport?.id) {
      toast.error("ID report mancante. Impossibile salvare.");
      return false;
    }
    
    setBp7IsLoading(true);
    try {
      const { error } = await supabase
        .from('bp7_policy_alignment')
        .upsert({
          report_id: currentReport.id,
          ...bp7FormData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP7 data:", error);
        toast.error("Errore durante il salvataggio dei dati");
        return false;
      }
      
      setBp7LastSaved(new Date());
      setBp7NeedsSaving(false);
      toast.success("Dati allineamento politiche salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP7 data:", error);
      toast.error("Si è verificato un errore durante il salvataggio");
      return false;
    } finally {
      setBp7IsLoading(false);
    }
  };

  const saveBp8Data = async (): Promise<boolean> => {
    if (!currentReport?.id) {
      toast.error("ID report mancante. Impossibile salvare.");
      return false;
    }
    
    setBp8IsLoading(true);
    try {
      const { error } = await supabase
        .from('bp8_compliance_processes')
        .upsert({
          report_id: currentReport.id,
          ...bp8FormData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP8 data:", error);
        toast.error("Errore durante il salvataggio dei dati");
        return false;
      }
      
      setBp8LastSaved(new Date());
      setBp8NeedsSaving(false);
      toast.success("Dati processi compliance salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP8 data:", error);
      toast.error("Si è verificato un errore durante il salvataggio");
      return false;
    } finally {
      setBp8IsLoading(false);
    }
  };

  const saveBp9Data = async (): Promise<boolean> => {
    if (!currentReport?.id) {
      toast.error("ID report mancante. Impossibile salvare.");
      return false;
    }
    
    setBp9IsLoading(true);
    try {
      const { error } = await supabase
        .from('bp9_violations')
        .upsert({
          report_id: currentReport.id,
          ...bp9FormData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP9 data:", error);
        toast.error("Errore durante il salvataggio dei dati");
        return false;
      }
      
      setBp9LastSaved(new Date());
      setBp9NeedsSaving(false);
      toast.success("Dati violazioni salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP9 data:", error);
      toast.error("Si è verificato un errore durante il salvataggio");
      return false;
    } finally {
      setBp9IsLoading(false);
    }
  };

  const saveBp10Data = async (): Promise<boolean> => {
    if (!currentReport?.id) {
      toast.error("ID report mancante. Impossibile salvare.");
      return false;
    }
    
    setBp10IsLoading(true);
    try {
      const { error } = await supabase
        .from('bp10_work_life_balance')
        .upsert({
          report_id: currentReport.id,
          ...bp10FormData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP10 data:", error);
        toast.error("Errore durante il salvataggio dei dati");
        return false;
      }
      
      setBp10LastSaved(new Date());
      setBp10NeedsSaving(false);
      toast.success("Dati equilibrio lavoro-vita salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP10 data:", error);
      toast.error("Si è verificato un errore durante il salvataggio");
      return false;
    } finally {
      setBp10IsLoading(false);
    }
  };

  const saveBp11Data = async (): Promise<boolean> => {
    if (!currentReport?.id) {
      toast.error("ID report mancante. Impossibile salvare.");
      return false;
    }
    
    setBp11IsLoading(true);
    try {
      const { error } = await supabase
        .from('bp11_apprentices')
        .upsert({
          report_id: currentReport.id,
          ...bp11FormData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP11 data:", error);
        toast.error("Errore durante il salvataggio dei dati");
        return false;
      }
      
      setBp11LastSaved(new Date());
      setBp11NeedsSaving(false);
      toast.success("Dati apprendisti salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP11 data:", error);
      toast.error("Si è verificato un errore durante il salvataggio");
      return false;
    } finally {
      setBp11IsLoading(false);
    }
  };

  // Effect to load data for all BPs when the report changes
  useEffect(() => {
    if (currentReport?.id) {
      // Load data for all BP sections
      loadBP1Data();
      loadBP2Data();
      loadBP3Data();
      loadBP4Data();
      loadBP5Data();
      loadBP6Data();
      loadBP7Data();
      loadBP8Data();
      loadBP9Data();
      loadBP10Data();
      loadBP11Data();
    }
  }, [currentReport?.id]);

  // Individual load functions for each BP
  const loadBP1Data = async () => {
    if (!currentReport?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('bp1_revenue_sectors')
        .select('*')
        .eq('report_id', currentReport.id)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error loading BP1 data:", error);
        return;
      }
      
      if (data) {
        setBp1FormData(data);
        setBp1LastSaved(new Date(data.updated_at));
      }
    } catch (error) {
      console.error("Unexpected error loading BP1 data:", error);
    }
  };

  const loadBP2Data = async () => {
    if (!currentReport?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('bp2_gender_diversity')
        .select('*')
        .eq('report_id', currentReport.id)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error loading BP2 data:", error);
        return;
      }
      
      if (data) {
        setBp2FormData(data);
        setBp2LastSaved(new Date(data.updated_at));
      }
    } catch (error) {
      console.error("Unexpected error loading BP2 data:", error);
    }
  };

  const loadBP3Data = async () => {
    if (!currentReport?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('bp3_ghg_targets')
        .select('*')
        .eq('report_id', currentReport.id)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error loading BP3 data:", error);
        return;
      }
      
      if (data) {
        setBp3FormData(data);
        setBp3LastSaved(new Date(data.updated_at));
      }
    } catch (error) {
      console.error("Unexpected error loading BP3 data:", error);
    }
  };

  const loadBP4Data = async () => {
    if (!currentReport?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('bp4_transition_plan')
        .select('*')
        .eq('report_id', currentReport.id)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error loading BP4 data:", error);
        return;
      }
      
      if (data) {
        setBp4FormData(data);
        setBp4LastSaved(new Date(data.updated_at));
      }
    } catch (error) {
      console.error("Unexpected error loading BP4 data:", error);
    }
  };

  const loadBP5Data = async () => {
    if (!currentReport?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('bp5_physical_risks')
        .select('*')
        .eq('report_id', currentReport.id)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error loading BP5 data:", error);
        return;
      }
      
      if (data) {
        setBp5FormData({
          hasPhysicalClimateRisks: data.has_physical_climate_risks,
          assetsAtRiskAmount: data.assets_at_risk_amount,
          assetsAtRiskPercentage: data.assets_at_risk_percentage,
          adaptationCoverage: data.adaptation_coverage,
          revenueAtRiskPercentage: data.revenue_at_risk_percentage,
          riskAssetsLocation: data.risk_assets_location,
          realEstateEnergyEfficiency: data.real_estate_energy_efficiency
        });
        setBp5LastSaved(new Date(data.updated_at));
      }
    } catch (error) {
      console.error("Unexpected error loading BP5 data:", error);
    }
  };

  const loadBP6Data = async () => {
    if (!currentReport?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('bp6_hazardous_waste')
        .select('*')
        .eq('report_id', currentReport.id)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error loading BP6 data:", error);
        return;
      }
      
      if (data) {
        setBp6FormData(data);
        setBp6LastSaved(new Date(data.updated_at));
      }
    } catch (error) {
      console.error("Unexpected error loading BP6 data:", error);
    }
  };

  const loadBP7Data = async () => {
    if (!currentReport?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('bp7_policy_alignment')
        .select('*')
        .eq('report_id', currentReport.id)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error loading BP7 data:", error);
        return;
      }
      
      if (data) {
        setBp7FormData(data);
        setBp7LastSaved(new Date(data.updated_at));
      }
    } catch (error) {
      console.error("Unexpected error loading BP7 data:", error);
    }
  };

  const loadBP8Data = async () => {
    if (!currentReport?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('bp8_compliance_processes')
        .select('*')
        .eq('report_id', currentReport.id)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error loading BP8 data:", error);
        return;
      }
      
      if (data) {
        setBp8FormData(data);
        setBp8LastSaved(new Date(data.updated_at));
      }
    } catch (error) {
      console.error("Unexpected error loading BP8 data:", error);
    }
  };

  const loadBP9Data = async () => {
    if (!currentReport?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('bp9_violations')
        .select('*')
        .eq('report_id', currentReport.id)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error loading BP9 data:", error);
        return;
      }
      
      if (data) {
        setBp9FormData(data);
        setBp9LastSaved(new Date(data.updated_at));
      }
    } catch (error) {
      console.error("Unexpected error loading BP9 data:", error);
    }
  };

  const loadBP10Data = async () => {
    if (!currentReport?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('bp10_work_life_balance')
        .select('*')
        .eq('report_id', currentReport.id)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error loading BP10 data:", error);
        return;
      }
      
      if (data) {
        setBp10FormData(data);
        setBp10LastSaved(new Date(data.updated_at));
      }
    } catch (error) {
      console.error("Unexpected error loading BP10 data:", error);
    }
  };

  const loadBP11Data = async () => {
    if (!currentReport?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('bp11_apprentices')
        .select('*')
        .eq('report_id', currentReport.id)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error loading BP11 data:", error);
        return;
      }
      
      if (data) {
        setBp11FormData(data);
        setBp11LastSaved(new Date(data.updated_at));
      }
    } catch (error) {
      console.error("Unexpected error loading BP11 data:", error);
    }
  };

  // Effects to track form changes for each BP
  useEffect(() => {
    setBp1NeedsSaving(true);
  }, [bp1FormData]);

  useEffect(() => {
    setBp2NeedsSaving(true);
  }, [bp2FormData]);

  useEffect(() => {
    setBp3NeedsSaving(true);
  }, [bp3FormData]);

  useEffect(() => {
    setBp4NeedsSaving(true);
  }, [bp4FormData]);

  useEffect(() => {
    setBp5NeedsSaving(true);
  }, [bp5FormData]);

  useEffect(() => {
    setBp6NeedsSaving(true);
  }, [bp6FormData]);

  useEffect(() => {
    setBp7NeedsSaving(true);
  }, [bp7FormData]);

  useEffect(() => {
    setBp8NeedsSaving(true);
  }, [bp8FormData]);

  useEffect(() => {
    setBp9NeedsSaving(true);
  }, [bp9FormData]);

  useEffect(() => {
    setBp10NeedsSaving(true);
  }, [bp10FormData]);

  useEffect(() => {
    setBp11NeedsSaving(true);
  }, [bp11FormData]);

  const goToNextTab = () => {
    setSelectedIndex((prev) => Math.min(prev + 1, tabs.length - 1));
  };

  const goToPrevTab = () => {
    setSelectedIndex((prev) => Math.max(prev - 1, 0));
  };

  // Componente di navigazione tra le tab
  const TabNavigation = () => (
    <Tab.List className="flex space-x-1 overflow-x-auto p-1 bg-gray-100 rounded-xl mb-4">
      {tabs.map((tab, index) => (
        <Tab
          key={tab.id}
          className={({ selected }) =>
            `w-full py-2.5 text-sm font-medium leading-5 rounded-lg whitespace-nowrap px-3
             ${selected
              ? 'bg-white shadow text-blue-700'
              : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600'
            }`
          }
        >
          {tab.name}
        </Tab>
      ))}
    </Tab.List>
  );

  // Pulsanti di navigazione
  const NavigationButtons = () => (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={goToPrevTab}
        disabled={selectedIndex === 0}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Precedente
      </Button>
      <Button
        variant="outline"
        onClick={goToNextTab}
        disabled={selectedIndex === tabs.length - 1}
      >
        Successivo
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="w-full">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <TabNavigation />
        
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <BP1RevenueSectors 
              formData={bp1FormData}
              setFormData={setBp1FormData}
              saveData={saveBp1Data}
              isLoading={bp1IsLoading}
              lastSaved={bp1LastSaved}
              needsSaving={bp1NeedsSaving}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP2GenderDiversity 
              formData={bp2FormData}
              setFormData={setBp2FormData}
              saveData={saveBp2Data}
              isLoading={bp2IsLoading}
              lastSaved={bp2LastSaved}
              needsSaving={bp2NeedsSaving}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP3GHGTargets 
              formData={bp3FormData}
              setFormData={setBp3FormData}
              saveData={saveBp3Data}
              isLoading={bp3IsLoading}
              lastSaved={bp3LastSaved}
              needsSaving={bp3NeedsSaving}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP4TransitionPlan 
              formData={bp4FormData}
              setFormData={setBp4FormData}
              saveData={saveBp4Data}
              isLoading={bp4IsLoading}
              lastSaved={bp4LastSaved}
              needsSaving={bp4NeedsSaving}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP5PhysicalRisks 
              formData={bp5FormData}
              setFormData={setBp5FormData}
              saveData={saveBp5Data}
              isLoading={bp5IsLoading}
              lastSaved={bp5LastSaved}
              needsSaving={bp5NeedsSaving}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP6HazardousWaste 
              formData={bp6FormData}
              setFormData={setBp6FormData}
              saveData={saveBp6Data}
              isLoading={bp6IsLoading}
              lastSaved={bp6LastSaved}
              needsSaving={bp6NeedsSaving}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP7PolicyAlignment 
              formData={bp7FormData}
              setFormData={setBp7FormData}
              saveData={saveBp7Data}
              isLoading={bp7IsLoading}
              lastSaved={bp7LastSaved}
              needsSaving={bp7NeedsSaving}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP8ComplianceProcesses 
              formData={bp8FormData}
              setFormData={setBp8FormData}
              saveData={saveBp8Data}
              isLoading={bp8IsLoading}
              lastSaved={bp8LastSaved}
              needsSaving={bp8NeedsSaving}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP9Violations 
              formData={bp9FormData}
              setFormData={setBp9FormData}
              saveData={saveBp9Data}
              isLoading={bp9IsLoading}
              lastSaved={bp9LastSaved}
              needsSaving={bp9NeedsSaving}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP10WorkLifeBalance 
              formData={bp10FormData}
              setFormData={setBp10FormData}
              saveData={saveBp10Data}
              isLoading={bp10IsLoading}
              lastSaved={bp10LastSaved}
              needsSaving={bp10NeedsSaving}
            />
          </Tab.Panel>
          
          <Tab.Panel>
            <BP11Apprentices 
              formData={bp11FormData}
              setFormData={setBp11FormData}
              saveData={saveBp11Data}
              isLoading={bp11IsLoading}
              lastSaved={bp11LastSaved}
              needsSaving={bp11NeedsSaving}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
      <NavigationButtons />
    </div>
  );
};

export default BusinessPartnersMetrics;
