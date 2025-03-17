
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { checkLocationData, ensureLocationData } from '../utils/locationDataUtils';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TableInfo {
  table: string;
  count: number;
  error?: string;
}

interface TableEntry {
  id: string | number;
  name?: string;
  code?: string;
  [key: string]: any;
}

const DatabaseDebugInfo = () => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [sampleData, setSampleData] = useState<{
    provinces: TableEntry[];
    municipalities: TableEntry[];
  }>({
    provinces: [],
    municipalities: []
  });
  const [populateStatus, setPopulateStatus] = useState<string | null>(null);
  const [provinceFilter, setProvinceFilter] = useState<string>("");

  const checkTables = async () => {
    setLoading(true);
    try {
      const tablesToCheck = ['provinces', 'municipalities'];
      const tablesInfo: TableInfo[] = [];
      
      for (const table of tablesToCheck) {
        try {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          
          tablesInfo.push({
            table,
            count: count || 0,
            error: error ? error.message : undefined
          });
        } catch (err: any) {
          tablesInfo.push({
            table,
            count: 0,
            error: err.message
          });
        }
      }
      
      setTables(tablesInfo);
      
      // Carica dati di esempio
      await loadSampleData();
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: `Errore durante il controllo delle tabelle: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = async () => {
    try {
      // Carica province di esempio
      const { data: provinces, error: provincesError } = await supabase
        .from('provinces')
        .select('*')
        .order('name')
        .limit(5);
      
      if (provincesError) throw provincesError;
      
      // Carica comuni di esempio
      const { data: municipalities, error: municipalitiesError } = await supabase
        .from('municipalities')
        .select('*')
        .order('name')
        .limit(5);
      
      if (municipalitiesError) throw municipalitiesError;
      
      setSampleData({
        provinces: provinces || [],
        municipalities: municipalities || []
      });
    } catch (error: any) {
      console.error('Errore durante il caricamento dei dati di esempio:', error);
    }
  };

  const loadMunicipalitiesByProvince = async () => {
    if (!provinceFilter) {
      toast({
        title: 'Nessuna provincia selezionata',
        description: 'Seleziona una provincia per visualizzare i comuni',
      });
      return;
    }
    
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('municipalities')
        .select('*', { count: 'exact' })
        .eq('province_code', provinceFilter)
        .order('name');
      
      if (error) throw error;
      
      setSampleData(prev => ({
        ...prev,
        municipalities: data || []
      }));
      
      toast({
        title: 'Comuni caricati',
        description: `Caricati ${count || 0} comuni per la provincia ${provinceFilter}`,
      });
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: `Errore durante il caricamento dei comuni: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const populateData = async () => {
    setLoading(true);
    setPopulateStatus("Inizializzazione popolamento dati...");
    try {
      setPopulateStatus("Controllo stato attuale delle tabelle...");
      const checkResult = await checkLocationData();
      
      if (checkResult.hasData) {
        setPopulateStatus("I dati sono già presenti nel database.");
        toast({
          title: 'Informazione',
          description: 'I dati di province e comuni sono già presenti'
        });
        setLoading(false);
        setTimeout(() => setPopulateStatus(null), 3000);
        return;
      }
      
      setPopulateStatus("Popolazione dati in corso...");
      const { data, error } = await supabase.functions.invoke('populate-italian-locations');
      
      if (error) {
        setPopulateStatus(`Errore: ${error.message}`);
        throw error;
      }
      
      setPopulateStatus("Dati popolati con successo, aggiornamento interfaccia...");
      toast({
        title: 'Successo',
        description: 'Dati popolati con successo'
      });
      
      await checkTables();
      setPopulateStatus("Completato!");
      setTimeout(() => setPopulateStatus(null), 3000);
    } catch (error: any) {
      setPopulateStatus(`Errore: ${error.message}`);
      toast({
        title: 'Errore',
        description: `Errore durante il popolamento dei dati: ${error.message}`,
        variant: 'destructive'
      });
      setTimeout(() => setPopulateStatus(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkTables();
  }, []);

  return (
    <Card className="p-4">
      <h3 className="text-md font-semibold mb-4">Debug Informazioni Database</h3>
      
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="status">Stato Tabelle</TabsTrigger>
          <TabsTrigger value="province">Province</TabsTrigger>
          <TabsTrigger value="municipalities">Comuni</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-semibold">Tabella</div>
              <div className="font-semibold">Conteggio</div>
              <div className="font-semibold">Stato</div>
              
              {tables.map((table) => (
                <React.Fragment key={table.table}>
                  <div>{table.table}</div>
                  <div>{table.count}</div>
                  <div className={table.error ? 'text-red-500' : 'text-green-500'}>
                    {table.error ? `Errore: ${table.error}` : 'OK'}
                  </div>
                </React.Fragment>
              ))}
            </div>
            
            {populateStatus && (
              <div className="p-2 border rounded bg-gray-50">
                <p className="flex items-center">
                  {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                  {populateStatus}
                </p>
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button 
                onClick={checkTables}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                {loading ? 
                  <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 
                  null}
                Aggiorna Stato
              </Button>
              
              <Button 
                onClick={populateData}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                {loading ? 
                  <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 
                  null}
                Popola Dati Province e Comuni
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="province">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Province ({sampleData.provinces.length} mostrate)</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Codice</th>
                    <th className="p-2 text-left">Nome</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleData.provinces.map(province => (
                    <tr key={province.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{province.code}</td>
                      <td className="p-2">{province.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <Button 
              onClick={loadSampleData}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              Aggiorna Dati
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="municipalities">
          <div className="space-y-4">
            <div className="flex space-x-2 items-end">
              <div className="flex-grow">
                <label className="text-sm">Filtra per codice provincia</label>
                <input 
                  type="text" 
                  value={provinceFilter}
                  onChange={(e) => setProvinceFilter(e.target.value.toUpperCase())}
                  placeholder="es. RM, MI, TO..."
                  className="w-full p-2 border rounded"
                  maxLength={2}
                />
              </div>
              <Button 
                onClick={loadMunicipalitiesByProvince}
                disabled={loading || !provinceFilter}
                variant="outline"
                size="sm"
              >
                {loading ? 
                  <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 
                  null}
                Filtra
              </Button>
            </div>
            
            <h4 className="text-sm font-semibold">Comuni ({sampleData.municipalities.length} mostrati)</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Nome</th>
                    <th className="p-2 text-left">Provincia</th>
                    <th className="p-2 text-left">CAP</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleData.municipalities.map(municipality => (
                    <tr key={municipality.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{municipality.id}</td>
                      <td className="p-2">{municipality.name}</td>
                      <td className="p-2">{municipality.province_code}</td>
                      <td className="p-2">
                        {Array.isArray(municipality.postal_codes) 
                          ? municipality.postal_codes.join(', ') 
                          : 'N/D'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DatabaseDebugInfo;
