
import { useBP1Data } from './bp1';
import { useBP2Data } from './bp2';
import { useBP3Data } from './bp3';
import { useBP4Data } from './bp4';
import { useBP5Data } from './bp5';
import { useBP6Data } from './bp6';
import { useBP7Data } from './bp7';
import { useBP8Data } from './bp8';
import { useBP9Data } from './bp9';
import { useBP10Data } from './bp10';
import { useBP11Data } from './bp11';

export const useBPModuleData = (reportId: string) => {
  // Inizializza gli hook individuali per ogni modulo BP
  const bp1 = useBP1Data(reportId);
  const bp2 = useBP2Data(reportId);
  const bp3 = useBP3Data(reportId);
  const bp4 = useBP4Data(reportId);
  const bp5 = useBP5Data(reportId);
  const bp6 = useBP6Data(reportId);
  const bp7 = useBP7Data(reportId);
  const bp8 = useBP8Data(reportId);
  const bp9 = useBP9Data(reportId);
  const bp10 = useBP10Data(reportId);
  const bp11 = useBP11Data(reportId);

  // Funzione centralizzata per salvare tutti i dati
  const saveAllData = async () => {
    const results = await Promise.all([
      bp1.saveData(),
      bp2.saveData(),
      bp3.saveData(),
      bp4.saveData(),
      bp5.saveData(),
      bp6.saveData(),
      bp7.saveData(),
      bp8.saveData(),
      bp9.saveData(),
      bp10.saveData(),
      bp11.saveData()
    ]);
    
    return results.every(result => result === true);
  };

  // Verifica se ci sono modifiche non salvate in qualsiasi modulo
  const hasUnsavedChanges = 
    bp1.needsSaving || 
    bp2.needsSaving || 
    bp3.needsSaving || 
    bp4.needsSaving || 
    bp5.needsSaving || 
    bp6.needsSaving || 
    bp7.needsSaving || 
    bp8.needsSaving || 
    bp9.needsSaving || 
    bp10.needsSaving || 
    bp11.needsSaving;

  // Stato del caricamento generale
  const isLoading = 
    bp1.isLoading || 
    bp2.isLoading || 
    bp3.isLoading || 
    bp4.isLoading || 
    bp5.isLoading || 
    bp6.isLoading || 
    bp7.isLoading || 
    bp8.isLoading || 
    bp9.isLoading || 
    bp10.isLoading || 
    bp11.isLoading;

  return {
    bp1,
    bp2,
    bp3,
    bp4,
    bp5,
    bp6,
    bp7,
    bp8,
    bp9,
    bp10,
    bp11,
    saveAllData,
    hasUnsavedChanges,
    isLoading
  };
};
