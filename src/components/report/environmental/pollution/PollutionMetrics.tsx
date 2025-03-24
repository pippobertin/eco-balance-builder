
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PollutionMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const PollutionMetrics: React.FC<PollutionMetricsProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      environmentalMetrics: {
        ...prev.environmentalMetrics,
        [name]: value
      }
    }));
  };

  const environmentalMetrics = formValues.environmentalMetrics || {};

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h4 className="text-lg font-medium mb-4">Inquinamento - Metriche Base</h4>
        
        <Tabs defaultValue="air" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="air">Inquinamento Aria</TabsTrigger>
            <TabsTrigger value="water">Inquinamento Acqua</TabsTrigger>
            <TabsTrigger value="soil">Inquinamento Suolo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="air" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="airPollution">Emissioni inquinanti in aria (kg)</Label>
                <Input
                  id="airPollution"
                  name="airPollution"
                  type="number"
                  value={environmentalMetrics.airPollution || ''}
                  onChange={handleChange}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">
                  Totale delle emissioni inquinanti in aria diverse dai gas serra
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="water" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="waterPollution">Scarichi inquinanti in acqua (kg)</Label>
                <Input
                  id="waterPollution"
                  name="waterPollution"
                  type="number"
                  value={environmentalMetrics.waterPollution || ''}
                  onChange={handleChange}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">
                  Totale degli scarichi inquinanti in acqua
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="soil" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="soilPollution">Contaminazione del suolo (kg)</Label>
                <Input
                  id="soilPollution"
                  name="soilPollution"
                  type="number"
                  value={environmentalMetrics.soilPollution || ''}
                  onChange={handleChange}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">
                  Totale delle sostanze contaminanti rilasciate nel suolo
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default PollutionMetrics;
