
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { FileType } from './types';

interface FileUploadTabsProps {
  fileType: FileType;
  setFileType: (value: FileType) => void;
  municipalitiesFile: File | null;
  postalCodesFile: File | null;
  handleMunicipalitiesFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePostalCodesFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadTabs: React.FC<FileUploadTabsProps> = ({
  fileType,
  setFileType,
  municipalitiesFile,
  postalCodesFile,
  handleMunicipalitiesFileChange,
  handlePostalCodesFileChange
}) => {
  return (
    <Tabs defaultValue="json" onValueChange={(value) => setFileType(value as FileType)}>
      <TabsList className="mb-4">
        <TabsTrigger value="json">JSON</TabsTrigger>
        <TabsTrigger value="csv">CSV</TabsTrigger>
      </TabsList>
      
      <TabsContent value="json">
        <div className="space-y-2">
          <Label htmlFor="municipalities-file-json">File dei comuni (JSON)</Label>
          <div className="flex items-center gap-2">
            <input
              id="municipalities-file-json"
              type="file"
              accept=".json"
              onChange={handleMunicipalitiesFileChange}
              className="max-w-xs"
            />
            {municipalitiesFile && fileType === 'json' && <Check className="h-4 w-4 text-green-500" />}
          </div>
          <p className="text-xs text-muted-foreground">
            Formato previsto: {"[{denominazione_ita: 'Nome Comune', sigla_provincia: 'XX', cap: '00000'}]"}
          </p>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="postal-codes-file-json">File dei CAP (opzionale)</Label>
          <div className="flex items-center gap-2">
            <input
              id="postal-codes-file-json"
              type="file"
              accept=".json"
              onChange={handlePostalCodesFileChange}
              className="max-w-xs"
            />
            {postalCodesFile && fileType === 'json' && <Check className="h-4 w-4 text-green-500" />}
          </div>
          <p className="text-xs text-muted-foreground">
            Formato previsto: {"{'Nome Comune': '00000'}"}
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="csv">
        <div className="space-y-2">
          <Label htmlFor="municipalities-file-csv">File dei comuni (CSV)</Label>
          <div className="flex items-center gap-2">
            <input
              id="municipalities-file-csv"
              type="file"
              accept=".csv"
              onChange={handleMunicipalitiesFileChange}
              className="max-w-xs"
            />
            {municipalitiesFile && fileType === 'csv' && <Check className="h-4 w-4 text-green-500" />}
          </div>
          <p className="text-xs text-muted-foreground">
            La prima riga deve contenere le intestazioni: denominazione_ita, sigla_provincia, cap, ecc.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default FileUploadTabs;
