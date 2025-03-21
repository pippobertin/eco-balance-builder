
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useBiodiversityLandUse } from './hooks/biodiversity';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Save } from "lucide-react";
import AutoSaveIndicator from '@/components/report/AutoSaveIndicator';

interface BiodiversitySectionProps {
  reportId?: string;
}

const BiodiversitySection: React.FC<BiodiversitySectionProps> = ({ reportId }) => {
  const {
    data,
    isLoading,
    isSaving,
    lastSaved,
    handleInputChange,
    saveData,
    calculateChanges
  } = useBiodiversityLandUse({ reportId });
  
  const changes = calculateChanges();
  
  const formatPercentChange = (value: number | null) => {
    if (value === null) return '-';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>B5. Biodiversità e Uso del Suolo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Caricamento dati in corso...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>B5. Biodiversità e Uso del Suolo</CardTitle>
        <div className="flex items-center gap-2">
          <AutoSaveIndicator lastSaved={lastSaved} />
          <Button 
            onClick={saveData} 
            disabled={isSaving || !reportId}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Salva
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Aree Sensibili Sotto il Profilo della Biodiversità</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md p-4">
                    <div className="space-y-2">
                      <p className="font-semibold">Significato:</p>
                      <p>Sono aree geografiche riconosciute a livello internazionale o europeo come particolarmente importanti per la conservazione della biodiversità. La biodiversità si riferisce alla varietà della vita sulla Terra, includendo specie animali, vegetali, ecosistemi e la loro diversità genetica.</p>
                      <p className="font-semibold">Esempi:</p>
                      <ul className="list-disc list-inside">
                        <li>Rete Natura 2000 (Zone di Protezione Speciale, Siti di Importanza Comunitaria)</li>
                        <li>Siti del Patrimonio Mondiale UNESCO</li>
                        <li>Key Biodiversity Areas (KBA)</li>
                        <li>Altre Aree Protette (Allegato II, Appendice D, Regolamento Delegato (UE) 2021/2139)</li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sensitive_sites_details" className="flex items-center gap-2">
                Dettagli sulle aree sensibili
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md p-4">
                      <div className="space-y-2">
                        <p className="font-semibold">In Prossimità (di aree sensibili):</p>
                        <p>"In prossimità" include due situazioni:</p>
                        <ul className="list-disc list-inside">
                          <li>Sovrapposizione (parziale): Il sito operativo dell'azienda si trova in parte all'interno di un'area sensibile.</li>
                          <li>Adiacenza: Il sito operativo dell'azienda confina direttamente con un'area sensibile.</li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Textarea 
                id="sensitive_sites_details"
                placeholder="Descrivi qui se le attività aziendali si svolgono all'interno o in prossimità di aree sensibili sotto il profilo della biodiversità"
                className="min-h-[100px]"
                value={data.sensitive_sites_details || ''}
                onChange={(e) => handleInputChange('sensitive_sites_details', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Uso del Suolo</h3>
              <Select 
                value={data.area_unit} 
                onValueChange={(value) => handleInputChange('area_unit', value)}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="Unità" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ha">ha</SelectItem>
                  <SelectItem value="m²">m²</SelectItem>
                  <SelectItem value="km²">km²</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="border p-2 text-left">Tipologia di Superficie</th>
                    <th className="border p-2 text-center w-28">Anno Corrente<br/>{data.area_unit}</th>
                    <th className="border p-2 text-center w-28">Anno Precedente<br/>{data.area_unit}</th>
                    <th className="border p-2 text-center w-28">Variazione</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 flex items-center gap-2">
                      Superficie impermeabilizzata
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md p-4">
                            <div className="space-y-2">
                              <p className="font-semibold">Superficie Impermeabilizzata:</p>
                              <p>Si riferisce all'area di terreno coperta da materiali impermeabili che impediscono all'acqua piovana di infiltrarsi nel suolo.</p>
                              <p className="font-semibold">Esempi:</p>
                              <ul className="list-disc list-inside">
                                <li>Edifici (tetti, superfici esterne)</li>
                                <li>Strade e parcheggi asfaltati o cementati</li>
                                <li>Piazzali industriali pavimentati</li>
                                <li>Marciapiedi e sentieri pavimentati</li>
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="border p-2">
                      <Input 
                        type="text"
                        value={data.current_impermeable_surface === null ? '' : data.current_impermeable_surface}
                        onChange={(e) => handleInputChange('current_impermeable_surface', e.target.value, true)}
                        className="text-center"
                      />
                    </td>
                    <td className="border p-2">
                      <Input 
                        type="text"
                        value={data.previous_impermeable_surface === null ? '' : data.previous_impermeable_surface}
                        onChange={(e) => handleInputChange('previous_impermeable_surface', e.target.value, true)}
                        className="text-center"
                      />
                    </td>
                    <td className="border p-2 text-center">
                      {formatPercentChange(changes.impermeable_surface_change)}
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="border p-2 flex items-center gap-2">
                      Superficie orientata alla natura (nel sito)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md p-4">
                            <div className="space-y-2">
                              <p className="font-semibold">Orientata alla Natura (nel sito):</p>
                              <p>Porzioni di terreno all'interno del sito operativo dell'azienda gestite o create per favorire la biodiversità e gli ecosistemi naturali.</p>
                              <p className="font-semibold">Esempi:</p>
                              <ul className="list-disc list-inside">
                                <li>Giardini naturalistici con piante autoctone</li>
                                <li>Stagni o zone umide artificiali</li>
                                <li>Boschetti o aree boscate</li>
                                <li>Tetti verdi</li>
                                <li>Fasce tampone vegetate</li>
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="border p-2">
                      <Input 
                        type="text"
                        value={data.current_nature_surface_onsite === null ? '' : data.current_nature_surface_onsite}
                        onChange={(e) => handleInputChange('current_nature_surface_onsite', e.target.value, true)}
                        className="text-center"
                      />
                    </td>
                    <td className="border p-2">
                      <Input 
                        type="text"
                        value={data.previous_nature_surface_onsite === null ? '' : data.previous_nature_surface_onsite}
                        onChange={(e) => handleInputChange('previous_nature_surface_onsite', e.target.value, true)}
                        className="text-center"
                      />
                    </td>
                    <td className="border p-2 text-center">
                      {formatPercentChange(changes.nature_surface_onsite_change)}
                    </td>
                  </tr>
                  
                  <tr>
                    <td className="border p-2 flex items-center gap-2">
                      Superficie orientata alla natura (fuori dal sito)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md p-4">
                            <div className="space-y-2">
                              <p className="font-semibold">Orientata alla Natura (fuori dal sito):</p>
                              <p>Azioni o progetti di conservazione e ripristino della biodiversità realizzati dall'azienda al di fuori del suo sito operativo.</p>
                              <p className="font-semibold">Esempi:</p>
                              <ul className="list-disc list-inside">
                                <li>Progetti di riforestazione o ripristino di habitat</li>
                                <li>Creazione o gestione di riserve naturali</li>
                                <li>Progetti di conservazione di specie minacciate</li>
                                <li>Corridoi ecologici</li>
                                <li>Agricoltura sostenibile o biodiversa</li>
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="border p-2">
                      <Input 
                        type="text"
                        value={data.current_nature_surface_offsite === null ? '' : data.current_nature_surface_offsite}
                        onChange={(e) => handleInputChange('current_nature_surface_offsite', e.target.value, true)}
                        className="text-center"
                      />
                    </td>
                    <td className="border p-2">
                      <Input 
                        type="text"
                        value={data.previous_nature_surface_offsite === null ? '' : data.previous_nature_surface_offsite}
                        onChange={(e) => handleInputChange('previous_nature_surface_offsite', e.target.value, true)}
                        className="text-center"
                      />
                    </td>
                    <td className="border p-2 text-center">
                      {formatPercentChange(changes.nature_surface_offsite_change)}
                    </td>
                  </tr>
                  
                  <tr className="font-semibold bg-gray-50 dark:bg-gray-900">
                    <td className="border p-2">Totale</td>
                    <td className="border p-2">
                      <Input 
                        type="text"
                        value={data.current_total_land_use === null ? '' : data.current_total_land_use}
                        onChange={(e) => handleInputChange('current_total_land_use', e.target.value, true)}
                        className="text-center font-semibold"
                      />
                    </td>
                    <td className="border p-2">
                      <Input 
                        type="text"
                        value={data.previous_total_land_use === null ? '' : data.previous_total_land_use}
                        onChange={(e) => handleInputChange('previous_total_land_use', e.target.value, true)}
                        className="text-center font-semibold"
                      />
                    </td>
                    <td className="border p-2 text-center">
                      {formatPercentChange(changes.total_land_use_change)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="text-sm text-gray-500 mt-2">
              Nota: Inserisci i valori numerici per ogni tipologia di superficie sia per l'anno corrente che per quello precedente. La variazione percentuale sarà calcolata automaticamente.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiodiversitySection;
