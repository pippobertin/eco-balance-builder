
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Funzione per verificare se i dati delle località sono stati caricati
export const checkLocationData = async () => {
  try {
    // Verifica se esistono province
    const { count: provinceCount, error: provinceError } = await supabase
      .from('provinces')
      .select('*', { count: 'exact', head: true });
    
    if (provinceError) {
      console.error('Errore nel controllo delle province:', provinceError);
      return { hasData: false, error: provinceError };
    }
    
    // Se non ci sono province, è necessario popolare i dati
    if (!provinceCount || provinceCount === 0) {
      return { hasData: false, error: null };
    }
    
    // Verifica se esistono comuni
    const { count: municipalityCount, error: municipalityError } = await supabase
      .from('municipalities')
      .select('*', { count: 'exact', head: true });
    
    if (municipalityError) {
      console.error('Errore nel controllo dei comuni:', municipalityError);
      return { hasData: false, error: municipalityError };
    }
    
    // Se non ci sono comuni, è necessario popolare i dati
    if (!municipalityCount || municipalityCount === 0) {
      return { hasData: false, error: null };
    }
    
    return { 
      hasData: true, 
      error: null,
      counts: {
        provinces: provinceCount,
        municipalities: municipalityCount
      }
    };
  } catch (error) {
    console.error('Errore durante il controllo dei dati delle località:', error);
    return { hasData: false, error };
  }
};

// Funzione per popolare i dati delle località se necessario
export const ensureLocationData = async () => {
  try {
    const checkResult = await checkLocationData();
    
    // Se i dati esistono già, non fare nulla
    if (checkResult.hasData) {
      console.log('I dati delle località sono già presenti nel database', checkResult.counts);
      return true;
    }
    
    console.log('Popolazione dei dati delle località necessaria...');
    
    // Chiama la funzione edge per popolare i dati
    const { data, error } = await supabase.functions.invoke('populate-italian-locations');
    
    if (error) {
      console.error('Errore durante la popolazione dei dati delle località:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile popolare i dati di province e comuni',
        variant: 'destructive',
      });
      return false;
    }
    
    console.log('Dati delle località popolati con successo:', data);
    return true;
  } catch (error) {
    console.error('Errore durante l\'esecuzione di ensureLocationData:', error);
    return false;
  }
};
